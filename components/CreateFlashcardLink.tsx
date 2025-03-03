import Link from "next/link";
import { Button } from "@/components/ui/button";

const CreateFlashcardLink = ({ moduleId }: { moduleId: string }) => (
    <Link href={`/flashcards/create?moduleId=${moduleId}`}>
        <Button>Create Flashcards</Button>
    </Link>
);

export default CreateFlashcardLink;
