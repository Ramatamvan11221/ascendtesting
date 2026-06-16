import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { FutureSelfContent } from "@/components/future-self/future-self-content";

export default async function FutureSelfPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const fs = await prisma.futureSelf.findUnique({ where: { userId: session.id } });
  const user = await prisma.user.findUnique({ where: { id: session.id }, select: { currentGoal: true, futureSelfGoal: true } });

  return (
    <AppLayout>
      <FutureSelfContent 
        existingData={fs ? JSON.parse(fs.content) : null}
        goal={user?.futureSelfGoal || user?.currentGoal || ""}
      />
    </AppLayout>
  );
}