import { NextFunction } from "express";
import { Request, Response } from "express";

export const bypassAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.user = {
      _id: "653165a6ab8d09896e5246d7",
      id: "111562325514402304894",
      provider: "google",
      displayName: "Muhire Heritier",
      name: {
        familyName: "Heritier",
        givenName: "Muhire",
      },
      email: "muhire416@gmail.com",
      emails: [
        {
          value: "muhire416@gmail.com",
          verified: true,
        },
      ],
      photos: [
        {
          value:
            "https://lh3.googleusercontent.com/a/ACg8ocLO06b0JCrOWuJuwBHdR16MDfqOCBP3iD17AiNK2wwbS80=s96-c",
        },
      ],
      __v: 0,
    };
    next();
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
    });
  }
};
