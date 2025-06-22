import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { AppSettings } from '@/types';

interface PropertiesPanelProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

const defaultColors = {
  background: '#1a1a1a',
  activeDot: '#22c55e',
  inactiveDot: '#374151'
};

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  settings,
  onSettingsChange
}) => {
  const [tempDuration, setTempDuration] = useState(settings.frameDuration.toString());
  const [tempRows, setTempRows] = useState(settings.gridDimensions.rows.toString());
  const [tempColumns, setTempColumns] = useState(settings.gridDimensions.columns.toString());

  const handleDurationChange = (value: string) => {
    setTempDuration(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 100 && numValue <= 1000) {
      onSettingsChange({
        ...settings,
        frameDuration: numValue
      });
    }
  };

  const handleDimensionChange = (dimension: 'rows' | 'columns', value: string) => {
    const numValue = parseInt(value);
    if (dimension === 'rows') {
      setTempRows(value);
      if (!isNaN(numValue) && numValue >= 4 && numValue <= 10) {
        onSettingsChange({
          ...settings,
          gridDimensions: {
            ...settings.gridDimensions,
            rows: numValue
          }
        });
      }
    } else {
      setTempColumns(value);
      if (!isNaN(numValue) && numValue >= 4 && numValue <= 10) {
        onSettingsChange({
          ...settings,
          gridDimensions: {
            ...settings.gridDimensions,
            columns: numValue
          }
        });
      }
    }
  };

  const handleColorChange = (colorType: keyof typeof settings.colors, color: string) => {
    onSettingsChange({
      ...settings,
      colors: {
        ...settings.colors,
        [colorType]: color
      }
    });
  };

  const handleResetColors = () => {
    onSettingsChange({
      ...settings,
      colors: { ...defaultColors }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Animation Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="duration">Frame Duration</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                id="duration"
                type="number"
                min="100"
                max="1000"
                value={tempDuration}
                onChange={(e) => handleDurationChange(e.target.value)}
                onBlur={() => {
                  const numValue = parseInt(tempDuration);
                  if (isNaN(numValue) || numValue < 100 || numValue > 1000) {
                    setTempDuration(settings.frameDuration.toString());
                  }
                }}
                className="w-20 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
              <Badge variant="secondary">ms</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Grid Dimensions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rows">Rows (4-10)</Label>
              <Input
                id="rows"
                type="number"
                min="4"
                max="10"
                value={tempRows}
                onChange={(e) => handleDimensionChange('rows', e.target.value)}
                onBlur={() => {
                  const numValue = parseInt(tempRows);
                  if (isNaN(numValue) || numValue < 4 || numValue > 10) {
                    setTempRows(settings.gridDimensions.rows.toString());
                  }
                }}
                className="mt-1 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
            <div>
              <Label htmlFor="columns">Columns (4-10)</Label>
              <Input
                id="columns"
                type="number"
                min="4"
                max="10"
                value={tempColumns}
                onChange={(e) => handleDimensionChange('columns', e.target.value)}
                onBlur={() => {
                  const numValue = parseInt(tempColumns);
                  if (isNaN(numValue) || numValue < 4 || numValue > 10) {
                    setTempColumns(settings.gridDimensions.columns.toString());
                  }
                }}
                className="mt-1 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Colors</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetColors}
              className="hover:bg-blue-500/10"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="background-color">Background</Label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  id="background-color"
                  type="color"
                  value={settings.colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-10 h-10 rounded border cursor-pointer"
                />
                <Badge variant="outline" className="font-mono text-xs">
                  {settings.colors.background}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="active-color">Active Dot</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    id="active-color"
                    type="color"
                    value={settings.colors.activeDot}
                    onChange={(e) => handleColorChange('activeDot', e.target.value)}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <Badge variant="outline" className="font-mono text-xs">
                    {settings.colors.activeDot}
                  </Badge>
                </div>
              </div>
              <div>
                <Label htmlFor="inactive-color">Inactive Dot</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    id="inactive-color"
                    type="color"
                    value={settings.colors.inactiveDot}
                    onChange={(e) => handleColorChange('inactiveDot', e.target.value)}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <Badge variant="outline" className="font-mono text-xs">
                    {settings.colors.inactiveDot}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};