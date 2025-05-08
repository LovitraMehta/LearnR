import Questions from "../models/Questions.js";
import users from "../models/auth.js";
import mongoose from "mongoose";
// import User from '../models/user.js';

export const AskQuestion = async (req, res) => {
  const postQuestionData = req.body;
  const userId = req.userId;
  const user = await users.findById(userId);
  const postQuestion = new Questions({ ...postQuestionData, userId }); 
  try {
    await postQuestion.save();
    //userUpdateNoOfQuestions(userId, user.noOfQuestionsAsked+1);
    user.noOfQuestionsAsked = user.noOfQuestionsAsked+1;
    user.myQuestions.push(postQuestion._id);
    await users.findByIdAndUpdate(userId,user);
    res.status(200).json("Posted a question successfully");
  } catch (error) {
    console.log(error);
    res.status(409).json("Couldn't post a new question");
  }
};



export const getAllQuestions = async (req, res) => {
  try {
    const questionList = await Questions.find().sort({ askedOn: -1 });
    res.status(200).json(questionList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  const userId = req.userId;
  const user = await users.findById(userId);

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    user.myQuestions = user.myQuestions.filter((id) => id !== String(_id));
    await Questions.findByIdAndRemove(_id);
    user.noOfQuestionsAsked = user.noOfQuestionsAsked-1;
    await users.findByIdAndUpdate(userId,user);
    res.status(200).json({ message: "successfully deleted..." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const voteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value } = req.body;
  const userId = req.userId;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    const question = await Questions.findById(_id);
    const upIndex = question.upVote.findIndex((id) => id === String(userId));
    const downIndex = question.downVote.findIndex(
      (id) => id === String(userId)
    );

    if (value === "upVote") {
      if (downIndex !== -1) {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
      if (upIndex === -1) {
        question.upVote.push(userId);
      } else {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
    } else if (value === "downVote") {
      if (upIndex !== -1) {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
      if (downIndex === -1) {
        question.downVote.push(userId);
      } else {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
    }
    await Questions.findByIdAndUpdate(_id, question);
    res.status(200).json({ message: "voted successfully..." });
  } catch (error) {
    res.status(404).json({ message: "id not found" });
  }
};

export const saveQuestion = async (req, res) => {
  const { id: questionId } = req.params;
  const userId = req.userId;

  try {
    const question = await Questions.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAlreadySaved = user.savedQuestions.findIndex(
      (id) => id.toString() === questionId
    );

    if (isAlreadySaved === -1) {
      user.savedQuestions.push(questionId);
    } else {
      user.savedQuestions = user.savedQuestions.filter(
        (id) => id.toString() !== questionId
      );
    }

    await user.save();

    // 🔁 Return the updated savedQuestions list
    res.status(200).json({ savedQuestions: user.savedQuestions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving/unsaving question", error });
  }
};