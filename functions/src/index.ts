import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as ytdl from "ytdl-core";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Endpoint to fetch video information
app.get("/getVideoInfo", async (req, res) => {
  const url = req.query.url as string;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: "Invalid or missing YouTube URL" });
  }

  try {
    const info = await ytdl.getInfo(url);
    const formats = info.formats.map(format => ({
      itag: format.itag,
      qualityLabel: format.qualityLabel,
      container: format.container,
      contentLength: format.contentLength,
      hasAudio: format.hasAudio,
      hasVideo: format.hasVideo,
    }));

    return res.json({
      title: info.videoDetails.title,
      formats: formats,
    });
  } catch (error) {
    console.error("Error fetching video info:", error);
    return res.status(500).json({ error: "Failed to fetch video info." });
  }
});

// Endpoint to download a video
app.get("/download", (req, res) => {
  const url = req.query.url as string;
  const itag = req.query.itag as string;
  const title = req.query.title as string || "video";

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: "Invalid or missing YouTube URL" });
  }

  if (!itag) {
    return res.status(400).json({ error: "Missing itag parameter" });
  }

  try {
    const format = ytdl.chooseFormat(ytdl.getInfo(url).then(info => info.formats), { quality: itag });
    const fileExtension = format && format.container ? format.container : 'mp4';
    
    // Set headers to trigger download
    res.header("Content-Disposition", `attachment; filename="${title}.${fileExtension}"`);

    ytdl(url, {
      filter: format => format.itag.toString() === itag,
    }).pipe(res);
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).json({ error: "Failed to download video." });
  }
});


// Expose Express API as a single Cloud Function:
export const api = functions.https.onRequest(app);
