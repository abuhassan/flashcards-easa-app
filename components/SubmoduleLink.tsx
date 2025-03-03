import Link from "next/link";
import { Button } from "@/components/ui/button";

const SubmoduleLink = ({ submodule, moduleId }: { submodule: any, moduleId: string }) => (
    <Link href={`/flashcards/create?moduleId=${moduleId}&subModuleId=${submodule.id}`}>
        <Button variant="outline" size="sm">
            Add Flashcards
        </Button>
    </Link>
);

export default SubmoduleLink;
