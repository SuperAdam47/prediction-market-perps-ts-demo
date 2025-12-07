import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import Confetti from "./Confetti";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FeedbackData) => void;
}

interface FeedbackData {
  enjoyment: string;
  favoriteFeature: string;
  suggestions: string;
  telegramHandle: string;
  brc20Wallet: string;
}

const FeedbackModal = ({ open, onOpenChange, onSubmit }: FeedbackModalProps) => {
  const [enjoyment, setEnjoyment] = useState("");
  const [favoriteFeature, setFavoriteFeature] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [brc20Wallet, setBrc20Wallet] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (open) {
      setShowConfetti(true);
    }
  }, [open]);

  const handleSubmit = () => {
    if (!enjoyment || !favoriteFeature) {
      return;
    }

    onSubmit({
      enjoyment,
      favoriteFeature,
      suggestions,
      telegramHandle,
      brc20Wallet,
    });

    setIsSubmitted(true);

    // Close modal after showing thank you message
    setTimeout(() => {
      setIsSubmitted(false);
      onOpenChange(false);
      // Reset form
      setEnjoyment("");
      setFavoriteFeature("");
      setSuggestions("");
      setTelegramHandle("");
      setBrc20Wallet("");
    }, 3000);
  };

  const handleClose = () => {
    if (!isSubmitted) {
      onOpenChange(false);
    }
  };

  return (
    <>
      <Confetti trigger={showConfetti && open} />
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="glass-strong border-primary/30 max-w-lg w-[95vw] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="text-center space-y-2 px-6 pt-6 pb-4">
            <div className="flex justify-center">
              <div className="relative">
                <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              </div>
            </div>
            <DialogTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              🎉 Congrats! You've earned +10 BNB!
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Please share your feedback via our official Google Form below to qualify for the launch airdrop.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center flex-1 px-6 pb-6 space-y-6 text-center">
            <p className="text-sm text-muted-foreground max-w-md">
              The form helps us gather insights from early users to improve the demo.
              It takes less than a minute.
            </p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSffCMDY-xrdYp66FiCVFf3Bmd-mhAW6BaY2lwFlNaX9l5rGdg/viewform?usp=dialog"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold px-6 py-2 rounded-xl">
                Open Google Form
              </Button>
            </a>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
            >
              Close
            </Button>
          </div>
        </DialogContent>

      </Dialog>
    </>
  );
};

export default FeedbackModal;

