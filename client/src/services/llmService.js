const parseJsonResponse = (content) => {
  try {
    return JSON.parse(content);
  } catch {
    throw new Error("AURA returned an invalid structured response.");
  }
};

export async function classifyAuraQuestion(question) {
  if (!question?.trim()) {
    throw new Error("AURA requires a question.");
  }

 const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/aura`, {
   method: "POST",

   headers: {
     "Content-Type": "application/json",
   },

   body: JSON.stringify({
     question: question.trim(),
   }),
 });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.error || `AURA request failed with status ${response.status}.`,
    );
  }

  const result = await response.json();

  if (!result.success || !result.intent) {
    throw new Error("AURA returned an invalid intent.");
  }

  return result.intent;
}

export { parseJsonResponse };
