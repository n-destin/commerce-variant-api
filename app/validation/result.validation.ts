import express, { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
export function getValidationResult(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).send({
      success: false,
      message: "You've submitted some invalid input(s)",
      errors: errors.mapped(),
    });
  return next();
}