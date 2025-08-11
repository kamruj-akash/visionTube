"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Download, Github, Loader2, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type VideoFormat = {
  quality: string;
  size: string;
};

type AudioFormat = {
  quality: string;
  size: string;
};

type FormatInfo = {
  title: string;
  formats: {
    video: VideoFormat[];
    audio: AudioFormat[];
  };
};

type SelectedFormat = {
  type: "video" | "audio";
  quality: string;
  size: string;
} | null;

const dummyData: FormatInfo = {
  title: "Speculative iOS 26 Design & Animation in VisionOS",
  formats: {
    video: [
      { quality: "1080p", size: "125 MB" },
      { quality: "720p", size: "78 MB" },
      { quality: "480p", size: "45 MB" },
      { quality: "360p", size: "25 MB" },
    ],
    audio: [
      { quality: "MP3 320kbps", size: "12 MB" },
      { quality: "M4A 128kbps", size: "9 MB" },
      { quality: "OPUS 160kbps", size: "10 MB" },
    ],
  },
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [showFormats, setShowFormats] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<SelectedFormat>(null);
  const [activeTab, setActiveTab] = useState<"video" | "audio">("video");
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleGetFormats = () => {
    if (!url) {
      toast({
        title: "URL is required",
        description: "Please paste a valid YouTube URL to get started.",
        variant: "destructive",
      })
      return;
    }
    setIsLoading(true);
    setSelectedFormat(null);
    setTimeout(() => {
      setShowFormats(true);
      setIsLoading(false);
    }, 2000);
  };
  
  const handleSelectFormat = (type: "video" | "audio", format: VideoFormat | AudioFormat) => {
    setSelectedFormat({ type, ...format });
  };

  const cardStyles = "w-[400px] h-[520px] bg-card/70 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-2xl shadow-black/30 p-8 flex flex-col";

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <main className="min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
        <h1 className="text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
          VisionTube
        </h1>
      </motion.div>

      <div className="relative h-[520px] w-full flex items-center justify-center" style={{ perspective: "1200px" }}>
        <motion.div
          className="absolute"
          animate={{ x: showFormats ? "-216px" : "0px", scale: showFormats ? 1 : 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className={cardStyles}>
            <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col h-full">
              <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">Download Center</motion.h2>
              <motion.p variants={itemVariants} className="text-muted-foreground mt-2">
                Paste a YouTube URL to begin.
              </motion.p>
              <div className="flex-grow flex flex-col justify-center space-y-4">
                <motion.div variants={itemVariants}>
                  <Input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    className="h-12 text-base bg-white/5 border-white/10 focus-visible:ring-primary focus-visible:ring-offset-0"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button
                    size="lg"
                    className="w-full h-12 text-base font-semibold"
                    onClick={handleGetFormats}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Get Formats"
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        <AnimatePresence>
          {showFormats && (
            <motion.div
              className="absolute"
              initial={{ opacity: 0, scale: 0.9, x: "0px", zIndex: -1 }}
              animate={{ opacity: 1, scale: 1, x: "216px", zIndex: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: "0px", zIndex: -1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <div className={cardStyles}>
                <h3 className="text-xl font-semibold tracking-tight truncate">{dummyData.title}</h3>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "video" | "audio")} className="mt-4 flex-grow flex flex-col">
                  <TabsList className="bg-white/5 p-1 h-10">
                    <TabsTrigger value="video" className="w-full data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground">Video</TabsTrigger>
                    <TabsTrigger value="audio" className="w-full data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground">Audio</TabsTrigger>
                  </TabsList>
                  <div className="flex-grow mt-4 overflow-y-auto pr-2 -mr-2">
                     <TabsContent value="video" className="m-0">
                      <div className="space-y-2">
                        {dummyData.formats.video.map((format) => (
                          <button key={format.quality} onClick={() => handleSelectFormat('video', format)} className={cn("w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors", selectedFormat?.quality === format.quality ? 'bg-primary/90' : 'hover:bg-white/5')}>
                            <div>
                              <p className="font-medium">{format.quality}</p>
                              <p className="text-sm text-muted-foreground">{format.size}</p>
                            </div>
                            {selectedFormat?.quality === format.quality && <Check className="text-primary-foreground" />}
                          </button>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="audio" className="m-0">
                      <div className="space-y-2">
                        {dummyData.formats.audio.map((format) => (
                          <button key={format.quality} onClick={() => handleSelectFormat('audio', format)} className={cn("w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors", selectedFormat?.quality === format.quality ? 'bg-primary/90' : 'hover:bg-white/5')}>
                            <div>
                              <p className="font-medium">{format.quality}</p>
                              <p className="text-sm text-muted-foreground">{format.size}</p>
                            </div>
                            {selectedFormat?.quality === format.quality && <Check className="text-primary-foreground" />}
                          </button>
                        ))}
                      </div>
                    </TabsContent>
                  </div>
                  <Button size="lg" className="w-full h-12 text-base font-semibold mt-auto" disabled={!selectedFormat}>
                    <Download className="mr-2" />
                    Download
                  </Button>
                </Tabs>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <div className="bg-card/70 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-2 flex items-center gap-6 text-sm text-muted-foreground">
          <p>Crafted by Kamruzzaman</p>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/kamruj5" target="_blank" className="hover:text-foreground transition-colors"><Github size={18} /></Link>
            <Link href="https://twitter.com/kamruj_zaman" target="_blank" className="hover:text-foreground transition-colors"><Twitter size={18} /></Link>
            <Link href="https://www.linkedin.com/in/kamruj-zaman" target="_blank" className="hover:text-foreground transition-colors"><Linkedin size={18} /></Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
