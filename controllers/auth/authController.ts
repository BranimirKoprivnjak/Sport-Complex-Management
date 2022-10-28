import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import User from '../../models/User';

export const registerUser: RequestHandler = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ msg: 'Email or/and password missing.' });
  }

  const { email, password } = req.body;

  try {
    const emailExists = await User.findOne({ email }).exec();
    if (emailExists) {
      return res.status(400).json({ msg: 'Something went wrong.' });
    }

    const user = new User({ email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = {
      id: user.id,
      created: new Date().toString(),
    };

    jwt.sign(
      payload,
      (process.env.JWT_SECRET as jwt.Secret) || 'some secret',
      {
        expiresIn: '1 hour',
      },
      async (err, token) => {
        if (err) return res.status(403).json({ msg: 'Forbidden.' });

        console.log(token);

        res.status(200).json({ msg: 'User successfully created.' });

        const url = 'http://localhost:3000/verify?id=' + token;

        const transporter = nodemailer.createTransport({
          name: 'www.domain.com',
          host: 'smtp.domain.com',
          port: 323,
          secure: false,
          auth: {
            user: 'user@domain.com',
            pass: 'Password',
          },
        });

        transporter.sendMail(
          {
            from: 'user@domain.com',
            to: email,
            subject: 'Account Verification',
            text: 'Click on the link below to verify your account ' + url,
          },
          (error, info) => {
            if (error) throw error;
            transporter.close();
          }
        );
      }
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(400).json({ msg: 'Email or password incorrect.' });
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Email or password incorrect.' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: 'User is not verified' });
    }

    const payload = {
      id: user.id,
    };

    jwt.sign(
      payload,
      (process.env.JWT_SECRET as jwt.Secret) || 'some secret',
      {
        expiresIn: '30 days',
      },
      (err, token) => {
        if (err) return res.status(403).json({ msg: 'Forbidden.' });
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    next(error);
  }
};

export const verifyUser: RequestHandler = (req, res, next) => {
  const token = req.query.id as string;

  if (!token) return res.status(401).json({ msg: 'Authorization denied.' });

  try {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (err, decoded: JwtPayload) => {
        if (err) return res.status(403).json({ msg: 'Forbidden.' });

        // handle case where user is already verified
        await User.findByIdAndUpdate(decoded.id, {
          isVerified: true,
        });

        res.status(200).json({ msg: 'Account successfully verified.' });
      }
    );
  } catch (error) {
    next(error);
  }
};
