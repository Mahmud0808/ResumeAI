"use server";

import bcrypt from "bcryptjs";
import { getCollection } from "../mongodb";

interface UserDoc {
  name?: string | null;
  email: string;
  password?: string;
  emailVerified?: Date | null;
  image?: string | null;
}

/**
 * Creates an email+password account in the same `users` collection the
 * NextAuth adapter uses, so OAuth and credentials accounts share one identity
 * (linked by email).
 */
export async function signUpWithCredentials({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !password || password.length < 8) {
      return {
        success: false,
        error: "Email and a password of at least 8 characters are required.",
      };
    }

    const users = await getCollection<UserDoc>("users");
    const existing = await users.findOne({ email: normalizedEmail });

    if (existing) {
      if (existing.password) {
        return { success: false, error: "Email is already registered." };
      }
      // Account exists from OAuth/migration but has no password yet: set one.
      const hash = await bcrypt.hash(password, 10);
      await users.updateOne(
        { _id: existing._id },
        { $set: { password: hash, name: existing.name ?? name } }
      );
      return { success: true };
    }

    const hash = await bcrypt.hash(password, 10);
    await users.insertOne({
      name,
      email: normalizedEmail,
      password: hash,
      emailVerified: null,
      image: null,
    });

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to sign up: ${error.message}`);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
