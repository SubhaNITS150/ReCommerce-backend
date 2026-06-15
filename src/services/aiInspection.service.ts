import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const detectDamage = async (filePath: string) => {
  const MAX_RETRIES = 3;
  const TIMEOUT_MS = 120000; // 2 min — handles Render cold start

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`AI service attempt ${attempt}/${MAX_RETRIES}`);

      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));

      const response = await axios.post(
        `${process.env.AI_SERVICE_URL}/ai/damage-detection`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: TIMEOUT_MS
        }
      );

      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      console.error(`Attempt ${attempt} failed — status: ${status}, message: ${error.message}`);

      // Render cold start returns 502/503/504 — wait and retry
      if (
        (status === 502 || status === 503 || status === 504 || error.code === 'ECONNABORTED') &&
        attempt < MAX_RETRIES
      ) {
        const delay = attempt * 20000; // 20s, 40s
        console.log(`Render cold start, retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }
};

export default { detectDamage };
