import { Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import Interview from '../models/Interview';
import { AuthRequest } from '../middleware/authMiddleware';

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const interviews = await Interview.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching history' });
  }
};

export const getUserStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;
    }
    const stats = {
      xp: user.xp,
      streak: user.streak,
      badges: user.badges,
      level: user.level,
      skillLevel: user.skillLevel
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

export const setSkillLevel = async (req: AuthRequest, res: Response): Promise<void> => {
  const { skillLevel } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    user.skillLevel = skillLevel;
    await user.save();
    res.json({ message: 'Skill level updated successfully', skillLevel });
  } catch (error) {
    res.status(500).json({ message: 'Error setting skill level' });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, profileImage } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: 'Please provide current and new password' });
    return;
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password as string);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid current password' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error changing password' });
  }
};

