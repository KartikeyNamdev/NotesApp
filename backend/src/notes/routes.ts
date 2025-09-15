import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { protect } from "../auth/middleware.js";

const router = Router();
const prisma = new PrismaClient();

// Protect all note routes
router.use(protect);

// GET /auth/me - Get the current logged-in user's details
router.get("/me", protect, async (req, res) => {
  // This check confirms to TypeScript that req.user is defined.
  if (!req.user) {
    return res.status(401).json({ message: "Authentication error." });
  }

  const userId = req.user.id;
  const tenantId = req.user.tenantId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, role: true }, // Select only the safe fields
    });

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true, plan: true },
    });

    if (!user || !tenant) {
      return res.status(404).json({ message: "User or tenant not found." });
    }

    // Return a combined object with user and tenant details
    res.json({ user, tenant });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user details." });
  }
});

// POST /notes – Create a note
router.post("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { title, content } = req.body;
  const { id: authorId, tenantId } = req.user;

  // --- Subscription Gateway ---
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (tenant?.plan === "Free") {
    const noteCount = await prisma.note.count({ where: { tenantId } });
    if (noteCount >= 3) {
      return res
        .status(403)
        .json({ message: "Upgrade to Pro to create more notes." });
    }
  }

  const note = await prisma.note.create({
    data: { title, content, authorId, tenantId },
  });

  res.status(201).json({ data: note });
});

// GET /notes – List all notes for the current tenant
router.get("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const notes = await prisma.note.findMany({
    where: { tenantId: req.user.tenantId }, // --- Tenant Isolation ---
  });
  res.json({ data: notes });
});

// GET /notes/:id – Retrieve a specific note
router.get("/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const note = await prisma.note.findUnique({
    where: {
      id: req.params.id,
      tenantId: req.user.tenantId, // --- Tenant Isolation ---
    },
  });

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  res.json({ data: note });
});

// PUT /notes/:id – Update a note
router.put("/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { title, content } = req.body;
  const updatedNote = await prisma.note.updateMany({
    where: {
      id: req.params.id,
      tenantId: req.user.tenantId, // --- Tenant Isolation ---
    },
    data: { title, content },
  });

  if (updatedNote.count === 0) {
    return res.status(404).json({
      message: "Note not found or you do not have permission to edit it",
    });
  }
  res.json({ message: "Note updated" });
});

// DELETE /notes/:id – Delete a note
router.delete("/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const deletedNote = await prisma.note.deleteMany({
    where: {
      id: req.params.id,
      tenantId: req.user.tenantId, // --- Tenant Isolation ---
    },
  });

  if (deletedNote.count === 0) {
    return res.status(404).json({
      message: "Note not found or you do not have permission to delete it",
    });
  }
  res.status(204).send();
});

export default router;
