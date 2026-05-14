'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import PaletteIcon from '@mui/icons-material/Palette';
import { ACTIVE_BUSINESS_ID } from '../../../utils/constants';
import { getNimbusConfigData, updateNimbusConfigData } from '../../../services/api/themes.service';

// ─── Color helpers ────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!r) return '';
  return `rgb(${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)})`;
}

function hexToHsl(hex: string): string {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!r) return '';
  let rv = parseInt(r[1], 16) / 255;
  let gv = parseInt(r[2], 16) / 255;
  let bv = parseInt(r[3], 16) / 255;
  const max = Math.max(rv, gv, bv), min = Math.min(rv, gv, bv);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rv) h = ((gv - bv) / d + (gv < bv ? 6 : 0)) / 6;
    else if (max === gv) h = ((bv - rv) / d + 2) / 6;
    else h = ((rv - gv) / d + 4) / 6;
  }
  return `hsl(${Math.round(h * 360)},${Math.round(s * 100)}%,${Math.round(l * 100)}%)`;
}

function contrastColor(hex: string): string {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!r) return '#000';
  const lum = (0.299 * parseInt(r[1], 16) + 0.587 * parseInt(r[2], 16) + 0.114 * parseInt(r[3], 16)) / 255;
  return lum > 0.55 ? '#111111' : '#ffffff';
}

// ─── ColorCard ────────────────────────────────────────────────────────────────

function ColorCard({
  label, colorKey, config, onChange,
}: {
  label: string; colorKey: string; config: any;
  onChange: (path: string[], value: any) => void;
}) {
  const cc = config.websiteConfig?.[colorKey] || {};
  const hex = /^#[0-9a-fA-F]{3,6}$/.test(cc.hex || '') ? cc.hex : '#5932EA';
  const inputRef = useRef<HTMLInputElement>(null);

  const update = (newHex: string) => {
    onChange(['websiteConfig', colorKey, 'hex'], newHex);
    onChange(['websiteConfig', colorKey, 'rgb'], hexToRgb(newHex));
    onChange(['websiteConfig', colorKey, 'hsl'], hexToHsl(newHex));
    onChange(['websiteConfig', colorKey, 'type'], 'hex');
  };

  const textColor = contrastColor(hex);

  return (
    <Box sx={{
      flex: 1, minWidth: 140,
      borderRadius: 3, overflow: 'hidden',
      border: '1px solid', borderColor: 'divider',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.2s, transform 0.15s',
      '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.12)', transform: 'translateY(-2px)' },
    }}>
      <Tooltip title="Click swatch to open color picker">
        <Box
          onClick={() => inputRef.current?.click()}
          sx={{
            height: 88, background: hex, cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 0.5,
            position: 'relative',
          }}
        >
          <PaletteIcon sx={{ color: textColor, opacity: 0.7, fontSize: 24 }} />
          <Typography variant="caption" sx={{ color: textColor, opacity: 0.75, fontSize: 10 }}>
            Click to change
          </Typography>
          <input
            ref={inputRef}
            type="color"
            value={hex}
            onChange={(e) => update(e.target.value)}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
          />
        </Box>
      </Tooltip>
      <Box sx={{ px: 1.5, pb: 1.5, pt: 1 }}>
        <Typography variant="caption" fontWeight={700} sx={{
          color: 'text.secondary', textTransform: 'uppercase',
          letterSpacing: '0.08em', display: 'block', mb: 0.75,
        }}>
          {label}
        </Typography>
        <TextField
          value={cc.hex || ''}
          onChange={(e) => update(e.target.value)}
          size="small" fullWidth placeholder="#5932EA"
          inputProps={{ style: { fontFamily: 'monospace', fontSize: 13 } }}
          InputProps={{
            startAdornment: (
              <Box sx={{
                width: 14, height: 14, borderRadius: '50%',
                background: hex, border: '1.5px solid rgba(0,0,0,0.18)',
                mr: 1, flexShrink: 0,
              }} />
            ),
          }}
        />
        <Box sx={{ mt: 0.75, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace', fontSize: 10 }}>
            {hexToRgb(hex)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace', fontSize: 10 }}>
            {hexToHsl(hex)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── FontSection ──────────────────────────────────────────────────────────────

const FONT_OPTIONS: { name: string; family: string; googleFamily: string }[] = [
  { name: 'Inter',              family: 'sans-serif', googleFamily: 'Inter' },
  { name: 'Roboto',             family: 'sans-serif', googleFamily: 'Roboto' },
  { name: 'Open Sans',          family: 'sans-serif', googleFamily: 'Open+Sans' },
  { name: 'Lato',               family: 'sans-serif', googleFamily: 'Lato' },
  { name: 'Montserrat',         family: 'sans-serif', googleFamily: 'Montserrat' },
  { name: 'Poppins',            family: 'sans-serif', googleFamily: 'Poppins' },
  { name: 'Raleway',            family: 'sans-serif', googleFamily: 'Raleway' },
  { name: 'Nunito',             family: 'sans-serif', googleFamily: 'Nunito' },
  { name: 'DM Sans',            family: 'sans-serif', googleFamily: 'DM+Sans' },
  { name: 'Work Sans',          family: 'sans-serif', googleFamily: 'Work+Sans' },
  { name: 'Source Sans Pro',    family: 'sans-serif', googleFamily: 'Source+Sans+3' },
  { name: 'Ubuntu',             family: 'sans-serif', googleFamily: 'Ubuntu' },
  { name: 'Oswald',             family: 'sans-serif', googleFamily: 'Oswald' },
  { name: 'PT Sans',            family: 'sans-serif', googleFamily: 'PT+Sans' },
  { name: 'Noto Sans',          family: 'sans-serif', googleFamily: 'Noto+Sans' },
  { name: 'Playfair Display',   family: 'serif',      googleFamily: 'Playfair+Display' },
  { name: 'Merriweather',       family: 'serif',      googleFamily: 'Merriweather' },
  { name: 'Lora',               family: 'serif',      googleFamily: 'Lora' },
  { name: 'PT Serif',           family: 'serif',      googleFamily: 'PT+Serif' },
  { name: 'EB Garamond',        family: 'serif',      googleFamily: 'EB+Garamond' },
  { name: 'Space Mono',         family: 'monospace',  googleFamily: 'Space+Mono' },
  { name: 'Fira Code',          family: 'monospace',  googleFamily: 'Fira+Code' },
  { name: 'JetBrains Mono',     family: 'monospace',  googleFamily: 'JetBrains+Mono' },
];

const FONT_FAMILIES = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'system-ui'];

const FONT_SIZE_OPTIONS = [
  '10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', '18px',
  '20px', '22px', '24px', '26px', '28px', '32px', '36px', '40px', '48px', '56px', '64px',
];

function FontSection({ config, onChange }: { config: any; onChange: (path: string[], value: any) => void }) {
  const fc = config.websiteConfig?.fontType || {};
  const fontFamily = fc.family || fc.name || 'inherit';
  const fontStyle = fc.style || 'normal';
  const sizeSmall = fc.size?.small || '14px';
  const sizeMedium = fc.size?.medium || '16px';
  const sizeLarge = fc.size?.large || '24px';
  const [fontLoaded, setFontLoaded] = useState(false);

  // Auto-load Google Font when name is picked from the list
  useEffect(() => {
    const chosen = FONT_OPTIONS.find((f) => f.name === fc.name);
    const src = chosen
      ? `https://fonts.googleapis.com/css2?family=${chosen.googleFamily}:ital,wght@0,400;0,600;1,400&display=swap`
      : fc.source || '';
    if (!src) { setFontLoaded(false); return; }
    setFontLoaded(false);
    let link = document.getElementById('nimbus-font-preview') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = 'nimbus-font-preview';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (link.href !== src) link.href = src;
    const onLoad = () => setFontLoaded(true);
    link.addEventListener('load', onLoad);
    if (link.sheet) setFontLoaded(true); // already cached
    return () => link!.removeEventListener('load', onLoad);
  }, [fc.name, fc.source]);

  const handleFontNameChange = (name: string) => {
    const chosen = FONT_OPTIONS.find((f) => f.name === name);
    onChange(['websiteConfig', 'fontType', 'name'], name);
    if (chosen) {
      onChange(['websiteConfig', 'fontType', 'family'], chosen.family);
      onChange(['websiteConfig', 'fontType', 'source'],
        `https://fonts.googleapis.com/css2?family=${chosen.googleFamily}:ital,wght@0,400;0,600;1,400&display=swap`
      );
    }
  };

  const previewStyle: React.CSSProperties = { fontFamily, fontStyle: fontStyle as any };

  const SIZE_ROWS = [
    { key: 'large',  label: 'Large',  path: ['websiteConfig', 'fontType', 'size', 'large'],  default: '24px' },
    { key: 'medium', label: 'Medium', path: ['websiteConfig', 'fontType', 'size', 'medium'], default: '16px' },
    { key: 'small',  label: 'Small',  path: ['websiteConfig', 'fontType', 'size', 'small'],  default: '14px' },
  ];

  return (
    <Box>
      {/* Row 1: name, family, style */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        {/* Font Name */}
        <Box sx={{ flex: 2, minWidth: 160 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Font Name</InputLabel>
            <Select
              value={fc.name || ''}
              label="Font Name"
              onChange={(e) => handleFontNameChange(e.target.value)}
              renderValue={(v) => (
                <span style={{ fontFamily: v || 'inherit' }}>{v as string}</span>
              )}
            >
              {['sans-serif', 'serif', 'monospace'].map((group) => [
                <MenuItem key={`g-${group}`} disabled sx={{ opacity: 1, fontWeight: 700, fontSize: 11,
                  textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary',
                  pointerEvents: 'none', py: 0.5 }}>
                  {group}
                </MenuItem>,
                ...FONT_OPTIONS.filter((f) => f.family === group).map((f) => (
                  <MenuItem key={f.name} value={f.name} sx={{ fontFamily: `'${f.name}', ${f.family}` }}>
                    {f.name}
                  </MenuItem>
                )),
              ])}
            </Select>
          </FormControl>
        </Box>

        {/* Font Family */}
        <Box sx={{ flex: 2, minWidth: 160 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Font Family</InputLabel>
            <Select
              value={fc.family || ''}
              label="Font Family"
              onChange={(e) => onChange(['websiteConfig', 'fontType', 'family'], e.target.value)}
              renderValue={(v) => (
                <span style={{ fontFamily: v as string }}>{v as string}</span>
              )}
            >
              {FONT_FAMILIES.map((fam) => (
                <MenuItem key={fam} value={fam} sx={{ fontFamily: fam }}>
                  {fam}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Style */}
        <Box sx={{ flex: 1, minWidth: 120 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Style</InputLabel>
            <Select
              value={fc.style || 'normal'}
              label="Style"
              onChange={(e) => onChange(['websiteConfig', 'fontType', 'style'], e.target.value)}
            >
              {['normal', 'italic', 'oblique'].map((s) => (
                <MenuItem key={s} value={s} sx={{ fontStyle: s as any, fontFamily }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Row 2: source URL (read-only when auto-set, editable for custom) */}
      <Box sx={{ mb: 2.5, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <TextField
          label="Google Fonts / Custom Font URL"
          value={fc.source || ''}
          onChange={(e) => onChange(['websiteConfig', 'fontType', 'source'], e.target.value)}
          size="small" fullWidth
          placeholder="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          helperText="Auto-filled when you pick a font above. Override with any custom URL."
        />
        {fc.source && (
          <Chip
            label={fontLoaded ? 'Loaded ✓' : 'Loading…'}
            color={fontLoaded ? 'success' : 'default'}
            size="small"
            sx={{ mt: 1, flexShrink: 0 }}
          />
        )}
      </Box>

      {/* Row 3: sizes */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <FormatSizeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        <Typography variant="body2" fontWeight={600}>Font Sizes</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {SIZE_ROWS.map(({ key, label, path, default: def }) => (
          <Box key={key} sx={{ flex: 1, minWidth: 110 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{label}</InputLabel>
              <Select
                value={fc.size?.[key] || ''}
                label={label}
                onChange={(e) => onChange(path, e.target.value)}
                renderValue={(v) => (
                  <span style={{ fontFamily, fontSize: v as string, lineHeight: 1.3 }}>{v as string}</span>
                )}
              >
                {FONT_SIZE_OPTIONS.map((sz) => (
                  <MenuItem key={sz} value={sz}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, width: '100%' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', width: 36, flexShrink: 0 }}>
                        {sz}
                      </Typography>
                      <span style={{ fontFamily, fontSize: sz, lineHeight: 1.3 }}>Aa</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}
      </Box>

      {/* Live preview panel */}
      <Box sx={{
        border: '1px solid', borderColor: 'divider',
        borderRadius: 2.5, overflow: 'hidden',
      }}>
        <Box sx={{
          px: 2, py: 1.25,
          background: 'linear-gradient(135deg, #f5f3ff 0%, #faf8ff 100%)',
          borderBottom: '1px solid', borderColor: 'divider',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Typography variant="caption" fontWeight={700} sx={{
            textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(89,50,234,0.8)',
          }}>
            Live Preview — {fc.name || 'Default Font'}
          </Typography>
          {fc.style && fc.style !== 'normal' && (
            <Chip label={fc.style} size="small" variant="outlined" sx={{ fontSize: 10 }} />
          )}
        </Box>
        <Box sx={{ p: 3, background: '#fff' }}>
          {[
            { label: 'Large', size: sizeLarge, text: 'The quick brown fox jumps over the lazy dog' },
            { label: 'Medium', size: sizeMedium, text: 'The quick brown fox jumps over the lazy dog — 0123456789' },
            { label: 'Small', size: sizeSmall, text: 'The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet consectetur.' },
          ].map(({ label, size, text }, i) => (
            <React.Fragment key={label}>
              {i > 0 && <Divider sx={{ my: 2 }} />}
              <Box>
                <Typography variant="caption" sx={{
                  color: 'text.disabled', textTransform: 'uppercase',
                  letterSpacing: '0.1em', display: 'block', mb: 0.5, fontSize: 10,
                }}>
                  {label} · {size}
                </Typography>
                <div style={{ ...previewStyle, fontSize: size, lineHeight: 1.4, color: '#1a1a1a' }}>
                  {text}
                </div>
              </Box>
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// ─── NimbusConfig ─────────────────────────────────────────────────────────────

interface NimbusConfigProps {
  onBack: () => void;
}

function NimbusConfig({ onBack }: NimbusConfigProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<any>({
    navbar: { heading: '', loginButton: '', signupButton: '' },
    footer: {
      subscription: { title: '', description: '', buttonText: '' },
      backgroundImage: '',
    },
    home: {
      banner: { title: '', subtitle: '', buttonText: '', bannerUrls: [] },
      aboutUs: { title: '', heading: '', bulletPoints: [], buttonText: '' },
      services: { heading: '', subheading: '' },
      appointment: { description: '', buttonText: '' },
      testimonials: { title: '', subTitle: '', buttonText: '' },
      teams: { title: '', subTitle: '', buttonText: '' },
      blogs: { title: '', subTitle: '', buttonText: '' },
    },
    aboutUs: {
      title: '',
      shortDescriptionTitle: '',
      longDescriptionTitle: '',
      bulletPoints: [],
      bannerUrl: '',
    },
    contactDetails: {
      heading: '',
      subheading: '',
      conversationTitle: '',
      conversationSubTitle: '',
      ctaText: '',
      bannerUrl: '',
    },
    services: { heading: '', subheading: '', bannerUrl: '' },
    blogs: { heading: '', subheading: '', bannerUrl: '' },
    albums: { title: '', subTitle: '', bannerUrl: '' },
    teams: {
      title: '',
      subTitle: '',
      members: { title: '', subTitle: '', bannerUrl: '' },
      member: { title: '', subTitle: '' },
    },
    websiteConfig: {
      primaryColor: { type: 'hex', hex: '' },
      secondaryColor: { type: 'hex', hex: '' },
      tertiaryColor: { type: 'hex', hex: '' },
      fontType: {
        type: 'config',
        name: '',
        family: '',
        style: 'normal',
        size: { large: '', small: '', medium: '' },
        source: '',
      },
    },
  });

  useEffect(() => {
    async function fetchConfig() {
      const businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
      if (!businessId) return;
      setLoading(true);
      const data = await getNimbusConfigData(businessId);
      if (data) {
        setConfig((prev: any) => deepMerge(prev, data));
      }
      setLoading(false);
    }
    fetchConfig();
  }, []);

  function deepMerge(target: any, source: any): any {
    if (!source) return target;
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (
        source[key] !== null &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        typeof target[key] === 'object' &&
        !Array.isArray(target[key])
      ) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else if (source[key] !== undefined) {
        result[key] = source[key];
      }
    }
    return result;
  }

  function setNestedValue(path: string[], value: any) {
    setConfig((prev: any) => {
      const updated = JSON.parse(JSON.stringify(prev));
      let cursor = updated;
      for (let i = 0; i < path.length - 1; i++) {
        if (!cursor[path[i]]) cursor[path[i]] = {};
        cursor = cursor[path[i]];
      }
      cursor[path[path.length - 1]] = value;
      return updated;
    });
  }

  function field(label: string, path: string[], multiline?: boolean) {
    const value = path.reduce((obj, key) => obj?.[key], config) ?? '';
    return (
      <TextField
        label={label}
        value={value}
        onChange={(e) => setNestedValue(path, e.target.value)}
        fullWidth
        size="small"
        multiline={multiline}
        minRows={multiline ? 2 : undefined}
        sx={{ mb: 2 }}
      />
    );
  }

  function selectField(label: string, path: string[], options: string[]) {
    const value = path.reduce((obj: any, key) => obj?.[key], config) ?? '';
    return (
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          label={label}
          onChange={(e) => setNestedValue(path, e.target.value)}
        >
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  async function handleSave() {
    const businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    if (!businessId) return;
    setSaving(true);
    await updateNimbusConfigData(businessId, config);
    setSaving(false);
  }

  const sectionStyle = { display: 'flex', flexDirection: 'column' as const, gap: 0, pt: 1 };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="w-full" style={{ fontFamily: 'Inter, Source Sans Pro, sans-serif' }}>
      <div className="p-4 md:p-6 bg-white shadow-md w-full" style={{ borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            variant="outlined"
            size="small"
            sx={{ borderColor: 'rgba(89,50,234,1)', color: 'rgba(89,50,234,1)', '&:hover': { borderColor: 'rgba(89,50,234,0.7)', background: 'rgba(89,50,234,0.05)' } }}
          >
            Back
          </Button>
          <Typography variant="h6" fontWeight={600}>Nimbus Theme Configuration</Typography>
        </div>

        {/* Navbar */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Navbar</Typography>
          </AccordionSummary>
          <AccordionDetails sx={sectionStyle}>
            {field('Heading', ['navbar', 'heading'])}
            {field('Login Button Text', ['navbar', 'loginButton'])}
            {field('Signup Button Text', ['navbar', 'signupButton'])}
          </AccordionDetails>
        </Accordion>

        {/* Footer */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Footer</Typography>
          </AccordionSummary>
          <AccordionDetails sx={sectionStyle}>
            {field('Background Image URL', ['footer', 'backgroundImage'])}
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, mt: 1 }}>Subscription</Typography>
            {field('Title', ['footer', 'subscription', 'title'])}
            {field('Description', ['footer', 'subscription', 'description'], true)}
            {field('Button Text', ['footer', 'subscription', 'buttonText'])}
          </AccordionDetails>
        </Accordion>

        {/* Home */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Home</Typography>
          </AccordionSummary>
          <AccordionDetails sx={sectionStyle}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Banner</Typography>
            {field('Title', ['home', 'banner', 'title'])}
            {field('Subtitle', ['home', 'banner', 'subtitle'])}
            {field('Button Text', ['home', 'banner', 'buttonText'])}

            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, mt: 1 }}>About Us</Typography>
            {field('Title', ['home', 'aboutUs', 'title'])}
            {field('Heading', ['home', 'aboutUs', 'heading'])}
            {field('Button Text', ['home', 'aboutUs', 'buttonText'])}

            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, mt: 1 }}>Services Section</Typography>
            {field('Heading', ['home', 'services', 'heading'])}
            {field('Subheading', ['home', 'services', 'subheading'])}

            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, mt: 1 }}>Appointment Banner</Typography>
            {field('Description', ['home', 'appointment', 'description'], true)}
            {field('Button Text', ['home', 'appointment', 'buttonText'])}

            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, mt: 1 }}>Testimonials Section</Typography>
            {field('Title', ['home', 'testimonials', 'title'])}
            {field('Subtitle', ['home', 'testimonials', 'subTitle'])}
            {field('Button Text', ['home', 'testimonials', 'buttonText'])}

            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, mt: 1 }}>Teams Section</Typography>
            {field('Title', ['home', 'teams', 'title'])}
            {field('Subtitle', ['home', 'teams', 'subTitle'])}
            {field('Button Text', ['home', 'teams', 'buttonText'])}

            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, mt: 1 }}>Blogs Section</Typography>
            {field('Title', ['home', 'blogs', 'title'])}
            {field('Subtitle', ['home', 'blogs', 'subTitle'])}
            {field('Button Text', ['home', 'blogs', 'buttonText'])}
          </AccordionDetails>
        </Accordion>

        {/* About Us page */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>About Us Page</Typography>
          </AccordionSummary>
          <AccordionDetails sx={sectionStyle}>
            {field('Title', ['aboutUs', 'title'])}
            {field('Short Description Title', ['aboutUs', 'shortDescriptionTitle'])}
            {field('Long Description Title', ['aboutUs', 'longDescriptionTitle'])}
            {field('Banner URL', ['aboutUs', 'bannerUrl'])}
          </AccordionDetails>
        </Accordion>

        {/* Contact Details */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Contact Details</Typography>
          </AccordionSummary>
          <AccordionDetails sx={sectionStyle}>
            {field('Heading', ['contactDetails', 'heading'])}
            {field('Subheading', ['contactDetails', 'subheading'])}
            {field('Conversation Title', ['contactDetails', 'conversationTitle'])}
            {field('Conversation Subtitle', ['contactDetails', 'conversationSubTitle'])}
            {field('CTA Text', ['contactDetails', 'ctaText'])}
            {field('Banner URL', ['contactDetails', 'bannerUrl'])}
          </AccordionDetails>
        </Accordion>

        {/* Services page */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Services Page</Typography>
          </AccordionSummary>
          <AccordionDetails sx={sectionStyle}>
            {field('Heading', ['services', 'heading'])}
            {field('Subheading', ['services', 'subheading'])}
            {field('Banner URL', ['services', 'bannerUrl'])}
          </AccordionDetails>
        </Accordion>

        {/* Blogs page */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Blogs Page</Typography>
          </AccordionSummary>
          <AccordionDetails sx={sectionStyle}>
            {field('Heading', ['blogs', 'heading'])}
            {field('Subheading', ['blogs', 'subheading'])}
            {field('Banner URL', ['blogs', 'bannerUrl'])}
          </AccordionDetails>
        </Accordion>

        {/* Albums page */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Albums Page</Typography>
          </AccordionSummary>
          <AccordionDetails sx={sectionStyle}>
            {field('Title', ['albums', 'title'])}
            {field('Subtitle', ['albums', 'subTitle'])}
            {field('Banner URL', ['albums', 'bannerUrl'])}
          </AccordionDetails>
        </Accordion>

        {/* Teams page */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Teams Page</Typography>
          </AccordionSummary>
          <AccordionDetails sx={sectionStyle}>
            {field('Title', ['teams', 'title'])}
            {field('Subtitle', ['teams', 'subTitle'])}
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, mt: 1 }}>Members List</Typography>
            {field('Title', ['teams', 'members', 'title'])}
            {field('Subtitle', ['teams', 'members', 'subTitle'])}
            {field('Banner URL', ['teams', 'members', 'bannerUrl'])}
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, mt: 1 }}>Individual Member</Typography>
            {field('Title', ['teams', 'member', 'title'])}
            {field('Subtitle', ['teams', 'member', 'subTitle'])}
          </AccordionDetails>
        </Accordion>

        {/* Website Config */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaletteIcon fontSize="small" sx={{ color: 'rgba(89,50,234,0.7)' }} />
              <Typography fontWeight={600}>Website Config — Colors &amp; Typography</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 2 }}>
            {/* Color palette */}
            <Typography variant="body2" fontWeight={700} sx={{
              mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'text.secondary', fontSize: 11,
            }}>
              Colour Palette
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3.5, flexWrap: 'wrap' }}>
              {[
                { label: 'Primary', key: 'primaryColor' },
                { label: 'Secondary', key: 'secondaryColor' },
                { label: 'Tertiary', key: 'tertiaryColor' },
              ].map(({ label, key }) => (
                <ColorCard
                  key={key}
                  label={label}
                  colorKey={key}
                  config={config}
                  onChange={setNestedValue}
                />
              ))}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Typography */}
            <Typography variant="body2" fontWeight={700} sx={{
              mb: 2, textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'text.secondary', fontSize: 11, display: 'flex', alignItems: 'center', gap: 0.75,
            }}>
              <FormatSizeIcon fontSize="inherit" /> Typography
            </Typography>
            <FontSection config={config} onChange={setNestedValue} />
          </AccordionDetails>
        </Accordion>

        {/* Save */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{
              background: 'rgba(89, 50, 234, 1)',
              '&:hover': { background: 'rgba(89, 50, 234, 0.85)' },
              minWidth: 120,
            }}
          >
            {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NimbusConfig;
