"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const SUGGESTED_QUESTIONS = [
  "What are common symptoms of flu?",
  "How can I improve my sleep?",
  "What foods are good for heart health?",
  "When should I see a doctor?",
  "How to manage stress and anxiety?",
  "Tips for a healthy lifestyle",
]

const QUICK_RESPONSES = {
  cold: "Common cold symptoms include sneezing, cough, sore throat, and runny nose. Rest, fluids, and over-the-counter medications can help. See a doctor if symptoms persist.",
  flu: "Flu symptoms include fever, body aches, fatigue, and respiratory symptoms. Antiviral medications, rest, and fluids are recommended. Vaccination is the best prevention.",
  headache:
    "Headaches can be caused by stress, dehydration, or other factors. Try resting in a dark room, staying hydrated, and taking over-the-counter pain relievers.",
  fever:
    "A fever indicates your body is fighting an infection. Stay hydrated, rest, and use fever-reducing medications like acetaminophen or ibuprofen.",
  sleep:
    "For better sleep, maintain a regular schedule, avoid screens before bed, keep your room cool, and try relaxation techniques like meditation.",
  exercise:
    "Adults should aim for 150 minutes of moderate exercise weekly. Start with activities you enjoy and gradually increase intensity.",
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: "intro",
      text: "Hello! I'm your AI Health Advisor. I'm here to provide general health information and guidance. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = async (userMessage) => {
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.slice(1),
        }),
      })

      if (!response.ok) throw new Error("Failed to get AI response")

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Error generating AI response:", error)
      return "I apologize, but I'm having trouble processing your question. Please try again or consult a healthcare professional."
    }
  }

  const getQuickResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    for (const [keyword, response] of Object.entries(QUICK_RESPONSES)) {
      if (lowerMessage.includes(keyword)) {
        return response
      }
    }
    return null
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setLoading(true)

    const userMsg = {
      id: Date.now().toString(),
      text: userMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])

    try {
      // Try quick response first
      let aiResponse = getQuickResponse(userMessage)

      // If no quick response, use AI
      if (!aiResponse) {
        aiResponse = await generateAIResponse(userMessage)
      }

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestedQuestion = (question) => {
    setInput(question)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Health Advisor</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-96 lg:h-[600px] flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-600"}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4 bg-gray-50">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me about your health..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <Button type="submit" disabled={loading || !input.trim()} className="bg-blue-600 hover:bg-blue-700">
                  Send
                </Button>
              </form>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-bold text-gray-900 mb-4">Suggested Topics</h3>
            <div className="space-y-2">
              {SUGGESTED_QUESTIONS.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="w-full text-left text-sm p-2 hover:bg-blue-50 rounded border border-gray-200 text-gray-700"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-gray-600">
                Disclaimer: This AI advisor provides general information only. For medical emergencies or serious
                conditions, please consult a qualified healthcare professional.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
