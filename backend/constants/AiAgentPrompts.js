export const geminiChatPrompt = (userQuestion, vectorResults) => {
  const context = vectorResults.map(
    ({ pageContent, metadata }) =>
      `Page ${metadata.page}:\n${pageContent}`
  ).join("\n\n");

  return `
You are an assistant that answers user questions based only on the provided document content.

Here is a question from the user:
"${userQuestion}"

And here are relevant document excerpts with page numbers:
${context}

Please answer the user's question strictly based on this content. Your response must be formatted exactly as a JSON object with the following shape:

{
  "text": "Your answer here",
  "page": 5
}

- The "text" field should contain a clear and concise answer.
- The "page" field should be the number of the page the most relevant content was found on.
- If multiple pages are relevant, choose the page with the best match.

⚠️ Do NOT include any explanation, formatting, or additional text. Just return the strict JSON object described above.
`;
};
