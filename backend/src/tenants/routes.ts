import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { protect, isAdmin } from "../auth/middleware.js";

const router = Router();
const prisma = new PrismaClient();

// POST /tenants/:slug/upgrade
router.post("/:slug/upgrade", protect, isAdmin, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { slug } = req.params;

  // This check fixes the TypeScript error
  if (!slug) {
    return res
      .status(400)
      .json({ message: "Tenant slug is required in the URL." });
  }

  // After the check, TypeScript knows 'slug' is a string
  const tenantToUpgrade = await prisma.tenant.findUnique({
    where: { slug },
  });

  if (!tenantToUpgrade || tenantToUpgrade.id !== req.user.tenantId) {
    return res
      .status(403)
      .json({ message: "Forbidden: You can only upgrade your own tenant." });
  }

  const updatedTenant = await prisma.tenant.update({
    where: { slug },
    data: { plan: "Pro" },
  });

  res.json({
    message: `Tenant ${updatedTenant.name} has been upgraded to Pro.`,
  });
});

export default router;
