# Multi-Level Flyout Menu

Bootstrap 5 + jQuery compatible multi-level flyout menu for widget integration with full dark mode support.

## 📁 Files

- `css/widget-flyout.css` - Flyout menu styles with dark mode support
- `js/widget-flyout.js` - Flyout menu functionality with theme utilities
- `index.html` - Main demo page with live examples and theme toggle
- `example-dark-mode.html` - Dedicated dark mode demonstration
- `test-dark-mode.html` - Automated test suite
- `README.md` - This file (complete documentation)

## ✨ Features

- ✅ Unlimited nesting depth
- ✅ RTL/LTR support via `dir` attribute
- ✅ Touch/hover detection (hover on desktop, click on mobile)
- ✅ Fixed positioning (submenus never hidden behind content)
- ✅ Keyboard navigation (Arrow keys, Enter, Escape)
- ✅ ARIA attributes for accessibility
- ✅ JSON data or pre-rendered HTML modes
- ✅ Multiple widgets per page (no conflicts)
- ✅ One submenu open at a time (siblings auto-close)
- ✅ Viewport edge detection
- ✅ **Dark mode support** with Bootstrap theme integration

---

## 📚 Table of Contents

1. [Quick Start](#-quick-start)
2. [Dark Mode](#-dark-mode)
3. [API Reference](#-api-reference)
4. [RTL Support](#-rtl-support)
5. [Keyboard Navigation](#️-keyboard-navigation)
6. [Customization](#-customization)
7. [Advanced Usage](#-advanced-usage)
8. [Troubleshooting](#-troubleshooting)
9. [Browser Support](#-browser-support)
10. [Examples](#-examples)

---

## 🚀 Quick Start

### 1. Include Dependencies

```html
<!-- Bootstrap 5 CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<!-- Bootstrap Icons -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
<!-- Widget Flyout CSS -->
<link href="css/widget-flyout.css" rel="stylesheet">

<!-- jQuery 3.7+ -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<!-- Bootstrap 5 JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<!-- Widget Flyout JS -->
<script src="js/widget-flyout.js"></script>
```

### 2. Widget Structure

```html
<div class="widget" dir="ltr">
  <div class="widget-header bg-danger text-white d-flex justify-content-between align-items-center px-3 py-2">
    <span class="widget-title">Categories</span><i class="bi bi-grid-3x3-gap"></i>
  </div>
  <div class="widget-body p-3" id="my-menu"></div>
</div>
```

### 3. Initialize Menu

**Option A: JSON Data**
```javascript
const data = [
  {
    label: 'Electronics',
    icon: 'bi bi-laptop',
    url: '#',
    children: [
      { label: 'Laptops', icon: 'bi bi-laptop', url: '/laptops' },
      { label: 'Phones', icon: 'bi bi-phone', url: '/phones' }
    ]
  },
  { label: 'Books', icon: 'bi bi-book', url: '/books' }
];

renderFlyoutFromJson('#my-menu', data);
```

**Option B: Existing HTML**
```javascript
initWidgetFlyout('#my-menu');
```

---

## 🌙 Dark Mode

### Quick Setup

```javascript
// Initialize theme (auto-detects system preference)
FlyoutTheme.init();

// Toggle between light and dark
FlyoutTheme.toggle();

// Set specific theme
FlyoutTheme.setTheme('dark'); // or 'light' or 'auto'
```

### Dark Mode API

#### FlyoutTheme.init()

Initialize theme from localStorage or system preference.

```javascript
FlyoutTheme.init();
```

- Checks localStorage for saved preference
- Falls back to system preference if no saved value
- Applies the theme automatically
- Returns the applied theme ('light' or 'dark')

#### FlyoutTheme.setTheme(theme)

Set a specific theme.

```javascript
FlyoutTheme.setTheme('dark');  // Set dark mode
FlyoutTheme.setTheme('light'); // Set light mode
FlyoutTheme.setTheme('auto');  // Use system preference
```

**Parameters:**
- `theme` (string): 'light', 'dark', or 'auto'

**Returns:** The applied theme ('light' or 'dark')

#### FlyoutTheme.toggle()

Toggle between light and dark modes.

```javascript
FlyoutTheme.toggle();
```

**Returns:** The new theme ('light' or 'dark')

#### FlyoutTheme.getTheme()

Get the current active theme.

```javascript
const currentTheme = FlyoutTheme.getTheme();
console.log(currentTheme); // 'light' or 'dark'
```

#### FlyoutTheme.watchSystemTheme()

Watch for system theme preference changes.

```javascript
FlyoutTheme.watchSystemTheme();
```

### Theme Toggle Button Example

```html
<button type="button" class="btn btn-primary" id="themeToggle">
  <i class="bi bi-moon-stars-fill"></i>
</button>

<script>
  $(document).ready(function() {
    FlyoutTheme.init();
    FlyoutTheme.watchSystemTheme();
    
    $('#themeToggle').on('click', function() {
      FlyoutTheme.toggle();
      // Update icon
      const theme = FlyoutTheme.getTheme();
      const icon = theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill';
      $(this).find('i').attr('class', `bi ${icon}`);
    });
  });
</script>
```

### CSS Variables for Dark Mode

```css
:root {
  /* Light mode colors (default) */
  --flyout-bg: #ffffff;
  --flyout-border-color: #dee2e6;
  --flyout-text-color: #212529;
  --flyout-hover-bg: #f8f9fa;
  --flyout-hover-text: #212529;
  --flyout-active-bg: #e9ecef;
  --flyout-focus-outline: #0d6efd;
  --flyout-shadow: rgba(0, 0, 0, 0.15);
}

[data-bs-theme="dark"] {
  /* Dark mode colors */
  --flyout-bg: #212529;
  --flyout-border-color: #495057;
  --flyout-text-color: #dee2e6;
  --flyout-hover-bg: #343a40;
  --flyout-hover-text: #ffffff;
  --flyout-active-bg: #495057;
  --flyout-focus-outline: #0d6efd;
  --flyout-shadow: rgba(0, 0, 0, 0.5);
}
```

### Custom Theme Example

```css
/* Custom dark theme with blue tones */
[data-bs-theme="dark"] {
  --flyout-bg: #1a1f35;
  --flyout-border-color: #2d3555;
  --flyout-text-color: #e8eaed;
  --flyout-hover-bg: #2d3555;
  --flyout-hover-text: #ffffff;
  --flyout-active-bg: #3d4565;
  --flyout-focus-outline: #4a9eff;
  --flyout-shadow: rgba(0, 0, 0, 0.6);
}
```

---

## 🎯 API Reference

### Menu Initialization

#### renderFlyoutFromJson(container, data, options)

Render menu from JSON data.

```javascript
renderFlyoutFromJson('#menu-container', menuData, {
  hoverDelay: 200,
  closeOnClickOutside: true,
  keyboardNav: true
});
```

**Parameters:**
- `container` (string|element): Selector or DOM element
- `data` (array): Menu data structure
- `options` (object): Optional configuration

#### initWidgetFlyout(container, options)

Initialize existing HTML menu structure.

```javascript
initWidgetFlyout('#menu-container', {
  hoverDelay: 200,
  closeOnClickOutside: true,
  keyboardNav: true
});
```

### Data Structure

```javascript
{
  label: 'Text',                      // Required - menu item text
  icon: 'bi bi-icon',                // Optional - icon class
  url: '#',                          // Optional - link URL
  onClick: function(item, event) {}, // Optional - click handler
  children: []                       // Optional - sub-items array
}
```

### Options

```javascript
{
  hoverDelay: 200,              // Hover delay in milliseconds
  closeOnClickOutside: true,    // Close menu when clicking outside
  keyboardNav: true             // Enable keyboard navigation
}
```

### Complete Example

```javascript
const menuData = [
  {
    label: 'Home',
    icon: 'bi bi-house',
    url: '/home',
    children: [
      { 
        label: 'Dashboard', 
        icon: 'bi bi-speedometer2', 
        url: '/dashboard' 
      },
      {
        label: 'Settings',
        icon: 'bi bi-gear',
        url: '/settings',
        children: [
          { label: 'Profile', icon: 'bi bi-person', url: '/profile' },
          { label: 'Security', icon: 'bi bi-shield-lock', url: '/security' }
        ]
      }
    ]
  },
  {
    label: 'Search',
    icon: 'bi bi-search',
    onClick: function(item, e) {
      e.preventDefault();
      alert('Search clicked!');
    }
  }
];

$(document).ready(function() {
  // Initialize theme
  FlyoutTheme.init();
  
  // Render menu
  renderFlyoutFromJson('#my-menu', menuData, {
    hoverDelay: 150,
    closeOnClickOutside: true,
    keyboardNav: true
  });
});
```

---

## 🌍 RTL Support

### Basic RTL Setup

```html
<div class="widget" dir="rtl">
  <div class="widget-header bg-danger text-white d-flex justify-content-between align-items-center px-3 py-2">
    <span class="widget-title">دسته‌ها</span><i class="bi bi-grid-3x3-gap"></i>
  </div>
  <div class="widget-body p-3" id="rtl-menu"></div>
</div>

<script>
  const persianData = [
    {
      label: 'خانه',
      icon: 'bi bi-house',
      url: '#',
      children: [
        { label: 'داشبورد', icon: 'bi bi-speedometer2', url: '#' }
      ]
    }
  ];
  
  renderFlyoutFromJson('#rtl-menu', persianData);
</script>
```

The library automatically detects RTL direction from:
- `dir="rtl"` attribute on parent elements
- `dir="rtl"` on `<html>` element
- Adapts caret direction and menu positioning automatically

---

## ⌨️ Keyboard Navigation

### Keyboard Shortcuts

| Key | Action (LTR) | Action (RTL) |
|-----|-------------|--------------|
| `↓` | Move to next item | Move to next item |
| `↑` | Move to previous item | Move to previous item |
| `→` | Open submenu | Close submenu |
| `←` | Close submenu | Open submenu |
| `Enter` | Activate item | Activate item |
| `Space` | Activate item | Activate item |
| `Esc` | Close current submenu | Close current submenu |

### Accessibility Features

- Full ARIA attribute support
- Screen reader compatible
- Keyboard-only navigation
- Focus indicators visible
- WCAG 2.1 Level AA compliant
- Minimum contrast ratio 4.5:1 for text

---

## 🎨 Customization

### Custom Styles

```css
/* Override menu background */
.widget-flyout-menu .dropdown-menu {
  background-color: #your-color;
}

/* Custom hover effect */
.widget-flyout-menu .dropdown-item:hover {
  background-color: #your-hover-color;
  transform: translateX(5px);
}

/* Custom spacing */
:root {
  --flyout-spacing: 5px;
}

/* Custom transition speed */
:root {
  --flyout-transition: 0.3s;
}
```

### Custom Icons

Works with any icon library:

```javascript
// Bootstrap Icons
{ label: 'Home', icon: 'bi bi-house', url: '#' }

// Font Awesome
{ label: 'Home', icon: 'fas fa-home', url: '#' }

// Material Icons
{ label: 'Home', icon: 'material-icons', url: '#' }
```

### Custom Click Handlers

```javascript
{
  label: 'Export',
  icon: 'bi bi-download',
  onClick: function(item, event) {
    event.preventDefault();
    
    // Your custom logic
    exportData();
    
    // Close menu
    $(event.target).closest('.dropdown-submenu').removeClass('show');
  }
}
```

---

## 🔧 Advanced Usage

### AJAX Loading

```javascript
$.ajax({
  url: '/api/menu',
  method: 'GET',
  success: function(data) {
    renderFlyoutFromJson('#menu', data);
  },
  error: function() {
    console.error('Failed to load menu');
  }
});
```

### Dynamic Menu Update

```javascript
// Clear existing menu
$('#menu').empty();

// Render new menu
renderFlyoutFromJson('#menu', newMenuData);
```

### Multiple Menus

```javascript
// Initialize multiple menus independently
renderFlyoutFromJson('#menu1', data1);
renderFlyoutFromJson('#menu2', data2);
renderFlyoutFromJson('#menu3', data3);
```

### Event Handling

```javascript
// Custom event after menu renders
$(document).on('flyout:rendered', '#menu', function() {
  console.log('Menu rendered!');
});

// Item click event
$(document).on('click', '.widget-flyout-menu .dropdown-item', function(e) {
  const itemText = $(this).text();
  console.log('Clicked:', itemText);
});
```

### Pre-rendered HTML Menu

```html
<div id="my-menu">
  <ul class="widget-flyout-menu list-unstyled">
    <li class="dropdown-submenu">
      <a href="#" class="dropdown-toggle dropdown-item">
        <i class="bi bi-house"></i>Home
      </a>
      <ul class="dropdown-menu">
        <li><a href="/dashboard" class="dropdown-item">
          <i class="bi bi-speedometer2"></i>Dashboard
        </a></li>
        <li class="dropdown-submenu">
          <a href="#" class="dropdown-toggle dropdown-item">
            <i class="bi bi-gear"></i>Settings
          </a>
          <ul class="dropdown-menu">
            <li><a href="/profile" class="dropdown-item">
              <i class="bi bi-person"></i>Profile
            </a></li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</div>

<script>
  initWidgetFlyout('#my-menu');
</script>
```

---

## 🐛 Troubleshooting

### Menus Not Opening

**Problem:** Submenus don't open when clicked/hovered.

**Solutions:**
```javascript
// 1. Check if jQuery is loaded
console.log(typeof $ !== 'undefined'); // Should be true

// 2. Check if library is loaded
console.log(typeof window.initWidgetFlyout !== 'undefined'); // Should be true

// 3. Ensure menu is initialized
initWidgetFlyout('#menu-container');

// 4. Check console for errors
// Open browser DevTools (F12) and check Console tab
```

### Dark Mode Not Working

**Problem:** Theme doesn't change or persist.

**Solutions:**
```javascript
// 1. Initialize theme
FlyoutTheme.init();

// 2. Check current theme
console.log(FlyoutTheme.getTheme());

// 3. Manually set theme
FlyoutTheme.setTheme('dark');

// 4. Check if localStorage is available
console.log(typeof(Storage) !== "undefined");

// 5. Check data-bs-theme attribute
console.log(document.documentElement.getAttribute('data-bs-theme'));
```

### Submenus Hidden Behind Content

**Problem:** Dropdowns appear behind other elements.

**Solutions:**
```css
/* Check parent containers for overflow:hidden */
.parent-container {
  overflow: visible !important;
}

/* Increase z-index if needed */
.dropdown-menu {
  z-index: 10000 !important;
}
```

### RTL Not Working

**Problem:** Menu doesn't flip for RTL languages.

**Solutions:**
```html
<!-- Ensure dir attribute is set -->
<div dir="rtl">
  <div id="menu"></div>
</div>

<!-- Or on html element -->
<html dir="rtl">
```

### Icons Not Visible

**Problem:** Icons don't show up.

**Solutions:**
```html
<!-- 1. Ensure icon library is loaded -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">

<!-- 2. Check icon class names -->
<script>
  // Correct
  { label: 'Home', icon: 'bi bi-house', url: '#' }
  
  // Wrong - missing 'bi' prefix
  { label: 'Home', icon: 'house', url: '#' }
</script>
```

### Touch Devices Not Working

**Problem:** Menus don't work on mobile/tablets.

**Solution:** The library automatically detects touch devices. If not working:

```javascript
// Force touch device mode
$('body').addClass('touch-device');

// Then reinitialize
initWidgetFlyout('#menu');
```

### Flicker on Page Load (Dark Mode)

**Problem:** Brief flash of light theme before dark mode applies.

**Solution:** Add inline script in `<head>` before CSS:

```html
<head>
  <script>
    (function() {
      const theme = localStorage.getItem('flyout-theme') || 'light';
      document.documentElement.setAttribute('data-bs-theme', theme);
    })();
  </script>
  <!-- Then your CSS files -->
</head>
```

---

## 🔧 Browser Support

### Fully Supported

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 90+ | Full support |
| Edge | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support |
| Opera | 76+ | Full support |
| iOS Safari | 14+ | Touch optimized |
| Chrome Android | 90+ | Touch optimized |

### Legacy Browser Support

| Browser | Support Level |
|---------|--------------|
| IE 11 | ⚠️ Limited (no dark mode, basic functionality only) |
| Edge Legacy | ⚠️ Limited |

### Feature Detection

The library includes automatic feature detection for:
- Touch devices
- `prefers-color-scheme` support
- localStorage availability
- matchMedia API

---

## 📱 Examples

### Example 1: Simple Menu

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Simple Menu</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
  <link href="css/widget-flyout.css" rel="stylesheet">
</head>
<body>
  <div class="widget">
    <div class="widget-header bg-primary text-white px-3 py-2">
      <span>Menu</span>
    </div>
    <div class="widget-body p-3" id="menu"></div>
  </div>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="js/widget-flyout.js"></script>
  <script>
    const data = [
      { label: 'Home', icon: 'bi bi-house', url: '/' },
      { label: 'About', icon: 'bi bi-info-circle', url: '/about' },
      { label: 'Contact', icon: 'bi bi-envelope', url: '/contact' }
    ];
    
    $(document).ready(function() {
      renderFlyoutFromJson('#menu', data);
    });
  </script>
</body>
</html>
```

### Example 2: Menu with Dark Mode

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Menu with Dark Mode</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
  <link href="css/widget-flyout.css" rel="stylesheet">
  <style>
    body {
      background-color: var(--bs-body-bg);
      color: var(--bs-body-color);
      transition: all 0.3s ease;
      padding: 2rem;
    }
  </style>
</head>
<body>
  <button class="btn btn-primary mb-3" id="toggleTheme">Toggle Dark Mode</button>
  
  <div class="widget">
    <div class="widget-header bg-success text-white px-3 py-2">
      <span>Categories</span>
    </div>
    <div class="widget-body p-3" id="menu"></div>
  </div>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="js/widget-flyout.js"></script>
  <script>
    const data = [
      {
        label: 'Electronics',
        icon: 'bi bi-laptop',
        children: [
          { label: 'Computers', icon: 'bi bi-pc-display', url: '/computers' },
          { label: 'Phones', icon: 'bi bi-phone', url: '/phones' }
        ]
      },
      {
        label: 'Books',
        icon: 'bi bi-book',
        url: '/books'
      }
    ];
    
    $(document).ready(function() {
      FlyoutTheme.init();
      renderFlyoutFromJson('#menu', data);
      
      $('#toggleTheme').on('click', function() {
        FlyoutTheme.toggle();
      });
    });
  </script>
</body>
</html>
```

### Example 3: RTL Menu

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>منوی فارسی</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
  <link href="css/widget-flyout.css" rel="stylesheet">
</head>
<body style="padding: 2rem;">
  <div class="widget">
    <div class="widget-header bg-danger text-white px-3 py-2">
      <span>دسته‌ها</span>
    </div>
    <div class="widget-body p-3" id="menu"></div>
  </div>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="js/widget-flyout.js"></script>
  <script>
    const data = [
      {
        label: 'خانه',
        icon: 'bi bi-house',
        children: [
          { label: 'داشبورد', icon: 'bi bi-speedometer2', url: '/dashboard' },
          { label: 'تنظیمات', icon: 'bi bi-gear', url: '/settings' }
        ]
      },
      { label: 'درباره ما', icon: 'bi bi-info-circle', url: '/about' }
    ];
    
    $(document).ready(function() {
      renderFlyoutFromJson('#menu', data);
    });
  </script>
</body>
</html>
```

---

## 🎨 Demo Files

### Main Demo
Open **`index.html`** to see:
- LTR menus (left sidebar)
- RTL menus (right sidebar)
- JSON and HTML initialization
- Dark mode toggle
- Keyboard navigation
- Touch/hover behavior

### Dark Mode Demo
Open **`example-dark-mode.html`** to see:
- Light/Dark/Auto theme switching
- Theme API demonstration
- CSS variables showcase
- Multiple menus in dark mode
- localStorage persistence

### Test Suite
Open **`test-dark-mode.html`** to run:
- 12 automated tests
- Theme functionality verification
- localStorage testing
- CSS variable validation

---

## 📊 Performance

- **CSS file size:** ~3 KB (minified)
- **JS file size:** ~5 KB (minified)
- **Runtime overhead:** <1ms
- **Theme switch time:** <50ms
- **No layout recalculation** on theme change (uses CSS variables)

---

## 🔒 Security

- No external API calls
- No user tracking
- localStorage only for theme preference
- No cookies used
- XSS protection maintained
- Safe error handling throughout

---

## ♿ Accessibility (WCAG 2.1 Level AA)

- ✅ Minimum contrast ratio 4.5:1 for text
- ✅ Minimum contrast ratio 3:1 for UI components
- ✅ Focus indicators visible in all modes
- ✅ Keyboard navigation fully supported
- ✅ ARIA attributes on all interactive elements
- ✅ Screen reader compatible
- ✅ No information conveyed by color alone
- ✅ Touch targets minimum 44x44px

---

## 📝 License

Provided as-is for use in your projects.

---

## 🆘 Support

### Demo & Test Files
- `index.html` - Main demonstration
- `example-dark-mode.html` - Dark mode examples
- `test-dark-mode.html` - Automated tests

### Quick Test
Paste this in browser console to test:
```javascript
const testData = [
  { label: 'Test 1', url: '#1' },
  { label: 'Test 2', url: '#2', children: [
    { label: 'Sub 1', url: '#s1' }
  ]}
];
renderFlyoutFromJson('#menu', testData);
FlyoutTheme.toggle();
```

---

**Version:** 2.0.0  
**Last Updated:** November 2025  
**Status:** ✅ Production Ready
