import { generateText } from "ai"

export const runtime = "nodejs"

export async function POST(request) {
  try {
    const { message, conversationHistory } = await request.json()

    const systemPrompt = `You are a helpful and professional health advisor AI. You provide general health information and guidance based on user questions. 
    
Important guidelines:
- Always emphasize consulting a qualified healthcare professional for serious conditions or emergencies
- Provide evidence-based health information
- Be empathetic and supportive in your responses
- Do not diagnose or prescribe medications
- Keep responses concise but informative
- If unsure, recommend consulting a doctor

Remember: This is for informational purposes only and not a substitute for professional medical advice.`

    const conversationContext = conversationHistory
      .map((msg) => `${msg.sender === "user" ? "User" : "AI"}: ${msg.text}`)
      .join("\n")

    const prompt = `${conversationContext}\nUser: ${message}\nAI:`

    const { text } = await generateText({
      model: "openai/gpt-3.5-turbo",
      system: systemPrompt,
      prompt: prompt,
      maxTokens: 500,
    })

    return Response.json({ response: text.trim() })
  } catch (error) {
    console.error("Chatbot error:", error)
    return Response.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
