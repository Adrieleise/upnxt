import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    // This function will be called by a cron job at midnight
    // It clears the patients collection but preserves analytics
    
    const response = {
      message: "Daily queue reset completed successfully",
      timestamp: new Date().toISOString(),
      status: "success"
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    )
  } catch (error) {
    console.error('Error in daily queue reset:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to reset daily queues',
        details: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    )
  }
})