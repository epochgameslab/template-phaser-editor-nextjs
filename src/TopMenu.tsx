// TopMenu.tsx
import * as React from 'react';
import {
  Sheet, Box, Stack, Typography, IconButton, Button, Link as JoyLink,
  Menu, MenuItem, Dropdown, List, ListItem, ListItemButton, Drawer, Divider, Badge, Avatar
} from '@mui/joy';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { useColorScheme } from '@mui/joy/styles';

// Optional: comment out if you’re not using Mesh
import { CardanoWallet } from '@meshsdk/react';

type NavLink = {
  label: string;
  href?: string;
  onClick?: () => void;
  children?: { label: string; href?: string; onClick?: () => void }[];
};

type TopMenuProps = {
  logo?: React.ReactNode;                 // e.g. <img .../> or <Avatar/>
  brand?: string;                         // text fallback if no logo node
  links?: NavLink[];
  currentPath?: string;                   // highlight active link
  showWallet?: boolean;                   // show Mesh ConnectWallet
  rightSlot?: React.ReactNode;            // anything else on the right (e.g. user avatar)
  elevation?: number;                     // 0..24 (soft)
  position?: 'sticky' | 'fixed' | 'static';
};

export default function TopMenu({
  logo,
  brand = 'YourApp',
  links = [],
  currentPath,
  showWallet = true,
  rightSlot,
  elevation = 6,
  position = 'sticky',
}: TopMenuProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Sheet
        component="header"
        color="neutral"
        variant="soft"
        sx={{
          position,
          top: 0,
          zIndex: 1100,
          backdropFilter: 'saturate(180%) blur(8px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: `sm`,
          ...(elevation ? { boxShadow: `lg` } : {}),
        }}
      >
        <Box
          sx={{
            maxWidth: 1280,
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            py: 1,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
            {/* Left cluster: hamburger (mobile) + brand */}
            <Stack direction="row" alignItems="center" gap={1.5}>
              <IconButton
                variant="plain"
                onClick={() => setOpen(true)}
                sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                aria-label="Open menu"
              >
                <MenuIcon />
              </IconButton>

              <Stack direction="row" alignItems="center" gap={1}>
                {logo ?? <Avatar size="sm" sx={{ bgcolor: 'primary.solidBg' }}>{brand[0] ?? '?'}</Avatar>}
                <Typography level="title-lg" sx={{ userSelect: 'none' }}>
                  {brand}
                </Typography>
              </Stack>
            </Stack>

            {/* Center: links (desktop) */}
            <Stack
              direction="row"
              gap={1}
              alignItems="center"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              {links.map((link) =>
                link.children?.length ? (
                  <Dropdown key={link.label}>
                    <Button
                      variant="plain"
                      endDecorator={<KeyboardArrowDown />}
                    >
                      {link.label}
                    </Button>
                    <Menu placement="bottom-start">
                      {link.children.map((c) => (
                        <MenuItem
                          key={c.label}
                          onClick={c.onClick}
                          component={c.href ? 'a' : 'button'}
                          href={c.href}
                        >
                          {c.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Dropdown>
                ) : (
                  <Button
                    key={link.label}
                    variant={isActive(currentPath, link.href) ? 'soft' : 'plain'}
                    component={link.href ? 'a' : 'button'}
                    href={link.href}
                    onClick={link.onClick}
                    sx={{ borderRadius: 'lg' }}
                  >
                    {link.label}
                  </Button>
                ),
              )}
            </Stack>

            {/* Right cluster */}
            <Stack direction="row" alignItems="center" gap={1.25}>
              <ColorSchemeToggle />
              {showWallet ? (
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <CardanoWallet label="Connect" isDark={true} persist={true}/>
                </Box>
              ) : null}
              {rightSlot ?? (
                <IconButton variant="plain" title="Notifications">
                  <Badge variant="solid" color="primary" size="sm" badgeContent="" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <Avatar size="sm" />
                  </Badge>
                </IconButton>
              )}
            </Stack>
          </Stack>
        </Box>
      </Sheet>

      {/* Mobile Drawer */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="left"
        slotProps={{ content: { sx: { width: 300 } } }}
      >
        <Sheet variant="plain" sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap={1}>
              {logo ?? <Avatar size="sm" sx={{ bgcolor: 'primary.solidBg' }}>{brand[0] ?? '?'}</Avatar>}
              <Typography level="title-lg">{brand}</Typography>
            </Stack>
            <IconButton variant="plain" onClick={() => setOpen(false)} aria-label="Close menu">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Sheet>
        <Divider />
        <List size="lg" sx={{ py: 1 }}>
          {links.map((link) =>
            link.children?.length ? (
              <Box key={link.label} sx={{ px: 1, py: 0.5 }}>
                <Typography level="title-sm" sx={{ mb: 0.5 }}>{link.label}</Typography>
                <List size="md" sx={{ '--ListItem-minHeight': '2.25rem' }}>
                  {link.children.map((c) => (
                    <ListItem key={c.label}>
                      <ListItemButton
                        component={c.href ? 'a' : 'button'}
                        href={c.href}
                        onClick={() => {
                          c.onClick?.();
                          setOpen(false);
                        }}
                      >
                        {c.label}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              <ListItem key={link.label}>
                <ListItemButton
                  component={link.href ? 'a' : 'button'}
                  href={link.href}
                  onClick={() => {
                    link.onClick?.();
                    setOpen(false);
                  }}
                  selected={isActive(currentPath, link.href)}
                >
                  {link.label}
                </ListItemButton>
              </ListItem>
            ),
          )}
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Stack direction="row" gap={1} alignItems="center">
            <ColorSchemeToggle />
            {showWallet ? <CardanoWallet label="Connect" /> : null}
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}

function isActive(currentPath?: string, href?: string) {
  if (!currentPath || !href) return false;
  try {
    const a = new URL(href, 'http://x').pathname;
    const b = new URL(currentPath, 'http://x').pathname;
    return b === a || (a !== '/' && b.startsWith(a));
  } catch {
    return currentPath === href || currentPath.startsWith(href);
  }
}

export function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  const cycle = React.useCallback(() => {
    setMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light');
  }, [mode, setMode]);
  const icon =
    mode === 'light' ? <LightModeIcon /> :
    mode === 'dark' ? <DarkModeIcon /> :
    <SettingsBrightnessIcon />;
  return (
    <IconButton variant="plain" onClick={cycle} title={`Theme: ${mode ?? 'system'}`}>
      {icon}
    </IconButton>
  );
}
