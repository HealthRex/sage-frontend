export async function postData<T>(url: string, data: { clinicalQuestion: string; clinicalNotes: string } | { question: string; clinicalNotes: string }): Promise<T> {
  try {
    console.log("Sending request to:", url);
    console.log("Request body:", data);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Ensure this is valid JSON
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get more error details
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
