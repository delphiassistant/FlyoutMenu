/**
 * Bootstrap 5 + jQuery Multi-Level Flyout Menu
 * Supports RTL/LTR, touch/hover, unlimited nesting, keyboard navigation
 */

(function($) {
  'use strict';

  // Detect touch device
  const isTouchDevice = () => {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
  };

  // Add touch-device class to body if needed
  if (isTouchDevice()) {
    $('body').addClass('touch-device');
  }

  /**
   * Check if element is in RTL context
   */
  function isRTL($element) {
    return $element.closest('[dir]').attr('dir') === 'rtl' || 
           $('html').attr('dir') === 'rtl' ||
           $element.attr('dir') === 'rtl';
  }

  /**
   * Check if submenu would overflow viewport
   */
  function checkViewportOverflow($submenu, direction) {
    const rect = $submenu[0].getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    if (direction === 'rtl') {
      return rect.left < 0;
    } else {
      return rect.right > viewportWidth;
    }
  }

  /**
   * Initialize flyout behavior on existing menu structure
   */
  function initWidgetFlyout(container, options) {
    const defaults = {
      hoverDelay: 200,
      closeOnClickOutside: true,
      keyboardNav: true
    };
    
    const settings = $.extend({}, defaults, options);
    const $container = $(container);
    
    if ($container.length === 0) return;
    
    const $menu = $container.find('ul').first();
    if (!$menu.hasClass('widget-flyout-menu')) {
      $menu.addClass('widget-flyout-menu');
    }
    
    // Add ARIA attributes
    initializeAccessibility($menu);
    
    // Setup event handlers
    if (isTouchDevice()) {
      setupTouchBehavior($menu, settings);
    } else {
      setupHoverBehavior($menu, settings);
    }
    
    // Keyboard navigation
    if (settings.keyboardNav) {
      setupKeyboardNavigation($menu);
    }
    
    // Close on outside click
    if (settings.closeOnClickOutside) {
      setupOutsideClick($menu);
    }
    
    return $menu;
  }

  /**
   * Render menu from JSON data
   */
  function renderFlyoutFromJson(container, data, options) {
    const $container = $(container);
    if ($container.length === 0) return;
    
    const $menu = buildMenuFromData(data);
    $container.empty().append($menu);
    
    return initWidgetFlyout(container, options);
  }

  /**
   * Build menu HTML from JSON data
   */
  function buildMenuFromData(items) {
    const $ul = $('<ul>', {
      class: 'widget-flyout-menu list-unstyled',
      role: 'menu'
    });
    
    items.forEach(item => {
      const $li = buildMenuItem(item);
      $ul.append($li);
    });
    
    return $ul;
  }

  /**
   * Build individual menu item
   */
  function buildMenuItem(item) {
    const hasChildren = item.children && item.children.length > 0;
    
    const $li = $('<li>', {
      class: hasChildren ? 'dropdown-submenu' : '',
      role: 'none'
    });
    
    if (hasChildren) {
      const $toggle = $('<a>', {
        class: 'dropdown-toggle dropdown-item',
        href: item.url || '#',
        role: 'menuitem',
        'aria-haspopup': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      });
      
      if (item.icon) {
        $toggle.append($('<i>', { class: item.icon }));
      }
      $toggle.append(document.createTextNode(item.label));
      
      const $submenu = $('<ul>', {
        class: 'dropdown-menu',
        role: 'menu',
        'aria-label': item.label
      });
      
      item.children.forEach(child => {
        $submenu.append(buildMenuItem(child));
      });
      
      $li.append($toggle, $submenu);
    } else {
      const $link = $('<a>', {
        class: 'dropdown-item',
        href: item.url || '#',
        role: 'menuitem',
        tabindex: '0'
      });
      
      if (item.icon) {
        $link.append($('<i>', { class: item.icon }));
      }
      $link.append(document.createTextNode(item.label));
      
      if (item.onClick) {
        $link.on('click', function(e) {
          e.preventDefault();
          item.onClick(item, e);
        });
      }
      
      $li.append($link);
    }
    
    return $li;
  }

  /**
   * Initialize ARIA attributes for accessibility
   */
  function initializeAccessibility($menu) {
    $menu.attr('role', 'menu');
    
    $menu.find('.dropdown-submenu').each(function() {
      const $submenu = $(this);
      const $toggle = $submenu.children('.dropdown-toggle').first();
      const $dropdown = $submenu.children('.dropdown-menu').first();
      
      $toggle.attr({
        'role': 'menuitem',
        'aria-haspopup': 'true',
        'aria-expanded': 'false',
        'tabindex': '0'
      });
      
      $dropdown.attr({
        'role': 'menu',
        'aria-label': $toggle.text().trim()
      });
    });
    
    $menu.find('.dropdown-item').not('.dropdown-toggle').attr({
      'role': 'menuitem',
      'tabindex': '0'
    });
  }

  /**
   * Setup hover behavior for desktop
   */
  function setupHoverBehavior($menu, settings) {
    let hoverTimer;
    
    $menu.find('.dropdown-submenu').each(function() {
      const $submenu = $(this);
      const $toggle = $submenu.children('.dropdown-toggle').first();
      const $dropdown = $submenu.children('.dropdown-menu').first();
      
      $submenu.on('mouseenter', function() {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          // Close all other open submenus at same level
          $submenu.siblings('.dropdown-submenu.show').each(function() {
            const $sibling = $(this);
            closeSubmenu(
              $sibling,
              $sibling.children('.dropdown-toggle').first(),
              $sibling.children('.dropdown-menu').first()
            );
          });
          openSubmenu($submenu, $toggle, $dropdown);
        }, settings.hoverDelay);
      });
      
      $submenu.on('mouseleave', function() {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          closeSubmenu($submenu, $toggle, $dropdown);
        }, settings.hoverDelay);
      });
      
      // Also allow click to toggle
      $toggle.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if ($submenu.hasClass('show')) {
          closeSubmenu($submenu, $toggle, $dropdown);
        } else {
          // Close siblings
          $submenu.siblings('.dropdown-submenu.show').each(function() {
            const $sibling = $(this);
            closeSubmenu(
              $sibling,
              $sibling.children('.dropdown-toggle').first(),
              $sibling.children('.dropdown-menu').first()
            );
          });
          openSubmenu($submenu, $toggle, $dropdown);
        }
      });
    });
  }

  /**
   * Setup touch behavior for mobile/tablet
   */
  function setupTouchBehavior($menu, settings) {
    $menu.find('.dropdown-submenu').each(function() {
      const $submenu = $(this);
      const $toggle = $submenu.children('.dropdown-toggle').first();
      const $dropdown = $submenu.children('.dropdown-menu').first();
      
      $toggle.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if ($submenu.hasClass('show')) {
          closeSubmenu($submenu, $toggle, $dropdown);
        } else {
          // Close all siblings at same level
          $submenu.siblings('.dropdown-submenu.show').each(function() {
            const $sibling = $(this);
            closeSubmenu(
              $sibling,
              $sibling.children('.dropdown-toggle').first(),
              $sibling.children('.dropdown-menu').first()
            );
          });
          // Close all other submenus at any level within the entire menu
          $menu.find('.dropdown-submenu.show').not($submenu).not($submenu.parents('.dropdown-submenu')).each(function() {
            const $other = $(this);
            // Don't close parent submenus
            if (!$other.find($submenu).length) {
              closeSubmenu(
                $other,
                $other.children('.dropdown-toggle').first(),
                $other.children('.dropdown-menu').first()
              );
            }
          });
          openSubmenu($submenu, $toggle, $dropdown);
        }
      });
    });
    
    // Prevent default link behavior on items with children
    $menu.find('.dropdown-submenu > a').on('click', function(e) {
      if ($(this).parent().hasClass('dropdown-submenu')) {
        e.preventDefault();
      }
    });
  }

  /**
   * Open submenu
   */
  function openSubmenu($submenu, $toggle, $dropdown) {
    $submenu.addClass('show');
    $toggle.attr('aria-expanded', 'true');
    $dropdown.addClass('show');
    
    // Position submenu using fixed positioning
    const rtl = isRTL($submenu);
    setTimeout(() => {
      positionSubmenu($submenu, $toggle, $dropdown, rtl);
    }, 10);
  }

  /**
   * Position submenu with fixed positioning
   */
  function positionSubmenu($submenu, $toggle, $dropdown, rtl) {
    const toggleRect = $toggle[0].getBoundingClientRect();
    const dropdownWidth = $dropdown.outerWidth();
    const dropdownHeight = $dropdown.outerHeight();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let top = toggleRect.top;
    let left;
    
    if (rtl) {
      // RTL: try to open to the left
      left = toggleRect.left - dropdownWidth;
      
      // Check if it overflows left edge
      if (left < 0) {
        // Open to the right instead
        left = toggleRect.right;
        $submenu.addClass('flyout-right').removeClass('flyout-left');
      } else {
        $submenu.addClass('flyout-left').removeClass('flyout-right');
      }
    } else {
      // LTR: try to open to the right
      left = toggleRect.right;
      
      // Check if it overflows right edge
      if (left + dropdownWidth > viewportWidth) {
        // Open to the left instead
        left = toggleRect.left - dropdownWidth;
        $submenu.addClass('flyout-left').removeClass('flyout-right');
      } else {
        $submenu.addClass('flyout-right').removeClass('flyout-left');
      }
    }
    
    // Check vertical overflow
    if (top + dropdownHeight > viewportHeight) {
      top = viewportHeight - dropdownHeight - 10;
    }
    
    if (top < 0) {
      top = 10;
    }
    
    // Apply position
    $dropdown.css({
      position: 'fixed',
      top: top + 'px',
      left: left + 'px',
      right: 'auto',
      bottom: 'auto'
    });
  }

  /**
   * Close submenu
   */
  function closeSubmenu($submenu, $toggle, $dropdown) {
    $submenu.removeClass('show');
    $toggle.attr('aria-expanded', 'false');
    $dropdown.removeClass('show');
    
    // Close all nested submenus
    $submenu.find('.dropdown-submenu.show').each(function() {
      const $nested = $(this);
      closeSubmenu(
        $nested,
        $nested.children('.dropdown-toggle').first(),
        $nested.children('.dropdown-menu').first()
      );
    });
  }

  /**
   * Setup keyboard navigation
   */
  function setupKeyboardNavigation($menu) {
    $menu.on('keydown', '.dropdown-item, .dropdown-toggle', function(e) {
      const $current = $(this);
      const $parent = $current.parent();
      const $parentMenu = $current.closest('ul');
      const rtl = isRTL($current);
      
      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault();
          navigateDown($current, $parentMenu);
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          navigateUp($current, $parentMenu);
          break;
          
        case 'ArrowRight':
          e.preventDefault();
          if (rtl) {
            navigateBack($current);
          } else {
            navigateInto($current);
          }
          break;
          
        case 'ArrowLeft':
          e.preventDefault();
          if (rtl) {
            navigateInto($current);
          } else {
            navigateBack($current);
          }
          break;
          
        case 'Escape':
          e.preventDefault();
          navigateBack($current);
          break;
          
        case 'Enter':
        case ' ':
          e.preventDefault();
          if ($parent.hasClass('dropdown-submenu')) {
            $current.click();
          } else {
            // Follow link
            if ($current.attr('href') && $current.attr('href') !== '#') {
              window.location.href = $current.attr('href');
            }
          }
          break;
      }
    });
  }

  /**
   * Navigate down to next item
   */
  function navigateDown($current, $parentMenu) {
    const $items = $parentMenu.children('li').find('> .dropdown-item, > .dropdown-toggle');
    const currentIndex = $items.index($current);
    const $next = $items.eq(currentIndex + 1);
    
    if ($next.length) {
      $next.focus();
    } else {
      $items.first().focus();
    }
  }

  /**
   * Navigate up to previous item
   */
  function navigateUp($current, $parentMenu) {
    const $items = $parentMenu.children('li').find('> .dropdown-item, > .dropdown-toggle');
    const currentIndex = $items.index($current);
    const $prev = $items.eq(currentIndex - 1);
    
    if ($prev.length) {
      $prev.focus();
    } else {
      $items.last().focus();
    }
  }

  /**
   * Navigate into submenu
   */
  function navigateInto($current) {
    const $parent = $current.parent();
    
    if ($parent.hasClass('dropdown-submenu')) {
      const $submenu = $parent.children('.dropdown-menu').first();
      const $toggle = $parent.children('.dropdown-toggle').first();
      
      if (!$parent.hasClass('show')) {
        openSubmenu($parent, $toggle, $submenu);
      }
      
      const $firstItem = $submenu.children('li').first().find('> .dropdown-item, > .dropdown-toggle').first();
      if ($firstItem.length) {
        $firstItem.focus();
      }
    }
  }

  /**
   * Navigate back to parent menu
   */
  function navigateBack($current) {
    const $parentMenu = $current.closest('ul');
    const $parentSubmenu = $parentMenu.parent('.dropdown-submenu');
    
    if ($parentSubmenu.length) {
      const $toggle = $parentSubmenu.children('.dropdown-toggle').first();
      closeSubmenu(
        $parentSubmenu,
        $toggle,
        $parentMenu
      );
      $toggle.focus();
    }
  }

  /**
   * Setup click outside to close
   */
  function setupOutsideClick($menu) {
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.widget-flyout-menu').length) {
        $menu.find('.dropdown-submenu.show').each(function() {
          const $submenu = $(this);
          closeSubmenu(
            $submenu,
            $submenu.children('.dropdown-toggle').first(),
            $submenu.children('.dropdown-menu').first()
          );
        });
      }
    });
  }

  /**
   * Dark mode / theme utilities
   */
  const FlyoutTheme = {
    /**
     * Set theme for Bootstrap 5
     * @param {string} theme - 'light', 'dark', or 'auto'
     */
    setTheme: function(theme) {
      if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDark ? 'dark' : 'light';
      }
      
      document.documentElement.setAttribute('data-bs-theme', theme);
      
      // Also set body class for legacy support
      if (theme === 'dark') {
        $('body').addClass('dark-mode');
      } else {
        $('body').removeClass('dark-mode');
      }
      
      // Store preference
      try {
        localStorage.setItem('flyout-theme', theme);
      } catch (e) {
        // Ignore if localStorage is not available
      }
      
      return theme;
    },
    
    /**
     * Get current theme
     */
    getTheme: function() {
      return document.documentElement.getAttribute('data-bs-theme') || 'light';
    },
    
    /**
     * Toggle between light and dark
     */
    toggle: function() {
      const current = this.getTheme();
      const newTheme = current === 'dark' ? 'light' : 'dark';
      return this.setTheme(newTheme);
    },
    
    /**
     * Initialize theme from localStorage or system preference
     */
    init: function() {
      let theme = 'light';
      
      try {
        theme = localStorage.getItem('flyout-theme');
      } catch (e) {
        // Ignore
      }
      
      if (!theme) {
        theme = 'auto';
      }
      
      return this.setTheme(theme);
    },
    
    /**
     * Watch for system theme changes
     */
    watchSystemTheme: function() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handler = (e) => {
        try {
          const stored = localStorage.getItem('flyout-theme');
          if (stored === 'auto' || !stored) {
            this.setTheme('auto');
          }
        } catch (err) {
          // Ignore
        }
      };
      
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handler);
      } else if (mediaQuery.addListener) {
        // Legacy browsers
        mediaQuery.addListener(handler);
      }
    }
  };

  // Export functions
  window.initWidgetFlyout = initWidgetFlyout;
  window.renderFlyoutFromJson = renderFlyoutFromJson;
  window.FlyoutTheme = FlyoutTheme;

})(jQuery);

