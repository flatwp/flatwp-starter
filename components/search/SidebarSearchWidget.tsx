/**
 * Sidebar Search Widget
 * A compact search widget designed for sidebar use
 * Uses the SearchInput component with sidebar-specific styling
 */

'use client';

import { SearchInput } from './SearchInput';

interface SidebarSearchWidgetProps {
  placeholder?: string;
}

export function SidebarSearchWidget({
  placeholder = 'Search posts...',
}: SidebarSearchWidgetProps) {
  return (
    <SearchInput
      placeholder={placeholder}
      showDropdown={true}
      maxDropdownResults={5}
      size="sm"
      showActiveIndicator={false}
    />
  );
}
