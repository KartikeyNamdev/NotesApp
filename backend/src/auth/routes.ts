import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  const token = jwt.sign(
    { userId: user.id, tenantId: user.tenantId, role: user.role },
    jwtSecret,
    { expiresIn: "1d" }
  );

  res.json({ token });
});
router.post("/signup", async (req, res, next) => {
  const { email, password, role, slug } = req.body;
  // Basic validation
  if (!email || !password || !slug) {
    return res.status(400).json({
      message:
        "Email, password, and Slug ( Company name acme or globex ) are required.",
    });
  }

  const tenant = await prisma.tenant.findFirst({
    where: {
      slug,
    },
  });
  if (!tenant) {
    return res.json({
      message: "Invalid tenant",
    });
  }
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    return res
      .json({
        message: "User already exists",
      })
      .status(401);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      role: role,
      tenantId: tenant?.id,
    },
  });

  res.json({
    msg: "User Created",
    newUser,
  });
});

export default router;
