"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export default function AdminFlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]); // ✅ Fix TypeScript issue

  useEffect(() => {
    async function fetchFlashcards() {
      const response = await axios.get("/api/admin/pending-flashcards");
      setFlashcards(response.data);
    }
    fetchFlashcards();
  }, []);

  async function approveFlashcard(id: string) {
    await axios.put(`/api/admin/approve-flashcard/${id}`);
    setFlashcards(flashcards.filter(f => f.id !== id));
  }

  async function rejectFlashcard(id: string) {
    await axios.delete(`/api/admin/reject-flashcard/${id}`);
    setFlashcards(flashcards.filter(f => f.id !== id));
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Pending Flashcards for Approval</h1>
      {flashcards.length === 0 ? (
        <p>No pending flashcards.</p>
      ) : (
        flashcards.map((flashcard) => (
          <div key={flashcard.id} className="border p-4 mb-4 rounded">
            <h2 className="font-bold">{flashcard.question}</h2>
            <p>{flashcard.answer}</p>
            <button onClick={() => approveFlashcard(flashcard.id)} className="bg-green-500 text-white px-4 py-2 mr-2">
              Approve
            </button>
            <button onClick={() => rejectFlashcard(flashcard.id)} className="bg-red-500 text-white px-4 py-2">
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}
