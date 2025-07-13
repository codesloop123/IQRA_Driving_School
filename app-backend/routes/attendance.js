const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Admission = require("../models/Admission");
const Instructor = require("../models/Instructor");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const saveToInstructor = async (savedAttendance, date, session) => {
  const { attendance } = savedAttendance;

  const formattedDate = new Date(date);

  // Populate admission so we can access referenceNumber
  await Admission.populate(attendance, {
    path: "admission",
    select: "referenceNumber",
  });

  const instructorIds = [
    ...new Set(attendance.map((entry) => entry.instructor.toString())),
  ];

  const instructors = await mongoose
    .model("Instructor")
    .find({ _id: { $in: instructorIds } })
    .session(session);

  console.log(instructors);
  for (const instructor of instructors) {
    for (const entry of attendance) {
      if (instructor._id.toString() === entry.instructor.toString()) {
        const refNo = entry.admission.referenceNumber;

        instructor.bookedSlots = await Promise.all(
          instructor.bookedSlots.map(async (slot) => {
            await Admission.populate(slot, {
              path: "admission",
              select: "referenceNumber",
            });
            console.log(slot)
            if (
              slot.admission.referenceNumber === refNo &&
              slot.date === formattedDate.toISOString()
            ) {
              return {
                ...slot,
                status: entry.status === "Present" ? "Completed" : "Missed",
              };
            }

            return slot;
          })
        );
      }
    }
    await instructor.save({ session });
  }

  await session.commitTransaction();
  session.endSession();
};

router.post("/:branch", async (req, res) => {
  console.log("/:branch", req);
  const { branch } = req.params;
  const { date, attendance } = req.body;

  if (!attendance.every((obj) => obj.status !== undefined)) {
    return res
      .status(400)
      .json({ message: "Kindly mark the attendance completely." });
  } else if (!date) {
    return res.status(400).json({ message: "Set the date" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Map refId → Admission._id
    const refIds = attendance.map((entry) => entry.refId);
    const admissions = await Admission.find({
      referenceNumber: { $in: refIds },
    });
    const admissionMap = {};
    admissions.forEach((adm) => {
      admissionMap[adm.referenceNumber] = adm._id;
    });

    const filteredattendance = attendance.map((entry) => {
      const admissionId = admissionMap[entry.refId];
      if (!admissionId)
        throw new Error(`Admission not found for refId: ${entry.refId}`);

      return {
        admission: admissionId,
        status: entry.status,
        name: entry.name,
        instructor: new mongoose.Types.ObjectId(entry.instructorId),
      };
    });

    let savedAttendance;
    const existingRecord = await Attendance.findOne({ branch, date }).session(
      session
    );

    if (existingRecord) {
      existingRecord.attendance = filteredattendance;
      savedAttendance = await existingRecord.save({ session });
    } else {
      const newAttendance = new Attendance({
        date,
        branch,
        attendance: filteredattendance,
      });
      savedAttendance = await newAttendance.save({ session });
    }

    await saveToInstructor(savedAttendance, date, session);

    res.status(201).json({ msg: "Attendance saved successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error saving attendance:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/students/:branchid/:date", async (req, res) => {
  console.log("/students/:branchid/:date", req.params);

  const { branchid, date } = req.params;

  async function getStudentDetailsForDateAndBranch(date, branchId) {
    try {
      const results = await Instructor.aggregate([
        {
          $match: {
            "branch._id": new ObjectId(branchId),
          },
        },
        {
          $unwind: "$bookedSlots",
        },
        {
          $match: {
            "bookedSlots.date": new Date(date).toISOString(),
          },
        },
        {
          $lookup: {
            from: "admissions",
            localField: "bookedSlots.admission",
            foreignField: "_id",
            as: "matchedAdmission",
          },
        },
        {
          $unwind: "$matchedAdmission",
        },
        {
          $project: {
            studentId: "$matchedAdmission._id",
            name: {
              $concat: [
                "$matchedAdmission.firstName",
                " ",
                "$matchedAdmission.lastName",
              ],
            },
            refId: "$matchedAdmission.referenceNumber",
            instructorName: "$name", // this is instructor's name
            instructorId: "$_id",
          },
        },
      ]);

      return results;
    } catch (error) {
      console.error("Error fetching student details:", error);
      throw error;
    }
  }

  try {
    const attendees = await getStudentDetailsForDateAndBranch(date, branchid);
    res.status(200).json(attendees);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:branch/:date", async (req, res) => {
  console.log("/:branch/:date", req.body);

  const { branch, date } = req.params;

  try {
    const attendanceRecord = await Attendance.aggregate([
      {
        $match: {
          branch: branch,
          date: date,
        },
      },
      {
        $unwind: "$attendance",
      },
      {
        $lookup: {
          from: "admissions",
          localField: "attendance.admission",
          foreignField: "_id",
          as: "admissionDetails",
        },
      },
      {
        $unwind: "$admissionDetails",
      },
      {
        $project: {
          _id: 1,
          firstName: "$admissionDetails.firstName",
          lastName: "$admissionDetails.lastName",
          refId: "$admissionDetails.referenceNumber", // keep for frontend use
          status: "$admissionDetails.status", // could be student status
          presence: "$attendance.status", // attendance status: Present/Absent/Leave
        },
      },
    ]);

    if (!attendanceRecord || attendanceRecord.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance found for this date." });
    }

    res.status(200).json(attendanceRecord);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:branch/history/:referenceId", async (req, res) => {
  console.log("/:branch/history/:referenceId", req.body);

  const { branch, referenceId } = req.params;

  try {
    // Step 1: Find the admission by referenceNumber
    const admission = await Admission.findOne({ referenceNumber: referenceId });

    if (!admission) {
      return res.status(404).json({ msg: "Student not found." });
    }

    // Step 2: Find all attendance records for this admission ID
    const attendanceHistory = await Attendance.find({
      branch,
      "attendance.admission": admission._id,
    });

    if (!attendanceHistory || attendanceHistory.length === 0) {
      return res
        .status(404)
        .json({ msg: "No attendance history found for this student." });
    }

    res.status(200).json(attendanceHistory);
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    res.status(500).json({ msg: "Server error" });
  }
});
module.exports = router;
