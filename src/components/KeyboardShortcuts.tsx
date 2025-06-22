import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Playback Controls",
    shortcuts: [
      { keys: ["Space"], description: "Play/Pause animation" },
      { keys: ["←", "A"], description: "Previous frame" },
      { keys: ["→", "D"], description: "Next frame" },
    ]
  },
  {
    title: "Frame Management",
    shortcuts: [
      { keys: ["Ctrl", "N"], description: "Create new frame" },
      { keys: ["Delete"], description: "Delete current frame" },
      { keys: ["Backspace"], description: "Delete current frame" },
    ]
  },
  {
    title: "General",
    shortcuts: [
      { keys: ["Escape"], description: "Stop playback / Close dialogs" },
      { keys: ["?"], description: "Show keyboard shortcuts" },
    ]
  }
];

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Keyboard Shortcuts</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {shortcutGroups.map((group, groupIndex) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <Badge variant="outline" className="text-xs font-mono px-2 py-1">
                            {key}
                          </Badge>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-xs text-muted-foreground">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {groupIndex < shortcutGroups.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground text-center pt-4 border-t">
          <p>Use <Badge variant="outline" className="text-xs">Cmd</Badge> instead of <Badge variant="outline" className="text-xs">Ctrl</Badge> on Mac</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};