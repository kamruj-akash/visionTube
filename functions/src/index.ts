import {https} from "firebase-functions";
import * as functions from "firebase-functions";
import * as express from "express";
import {Request, Response} from "express";
import * as cors from "cors";
import * as ytdl from "ytdl-core";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

// Endpoint to fetch video information
app.get("/getVideoInfo", async (req: Request, res: Response) => {
  try {
    const videoURL = req.query.url as string;

    if (!videoURL || !ytdl.validateURL(videoURL)) {
      return res.status(400).json({error: "Invalid or missing YouTube URL"});
    }

    const info = await ytdl.getInfo(videoURL);
    const formats = info.formats.map((format) => ({
      itag: format.itag,
      qualityLabel: format.qualityLabel,
      container: format.container,
      contentLength: format.contentLength,
      hasAudio: format.hasAudio,
      hasVideo: format.hasVideo,
    }));

    res.status(200).json({
      title: info.videoDetails.title,
      formats: formats,
    });
  } catch (error) {
    console.error("Error in /getVideoInfo:", error);
    res.status(500).json({error: "Failed to fetch video information."});
  }
});

// Endpoint to download a video
app.get("/download", (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    const itag = req.query.itag as string;
    const title = req.query.title as string;

    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({error: "Invalid or missing YouTube URL"});
    }
    if (!itag) {
      return res.status(400).json({error: "Missing itag parameter"});
    }

    res.setHeader("Content-Disposition", `attachment; filename="${title || "video"}.mp4"`);

    const videoStream = ytdl(url, {
      filter: (format) => format.itag.toString() === itag,
    });

    videoStream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({error: "Failed to download video due to a stream error."});
      }
    });

    videoStream.pipe(res);
  } catch (error) {
    console.error("Error in /download:", error);
    if (!res.headersSent) {
      res.status(500).json({error: "Failed to process download request."});
    }
  }
});


// Expose Express API as a single Cloud Function:
export const api = functions.runWith({memory: "1GB", timeoutSeconds: 120}).https.onRequest(app);
