/**
 * Utilities for formatting contact links (mailto: and tel: protocols)
 */

export const getTelHref = (phone: string): string => {
  if (!phone) return 'tel:';
  
  // Separate extension (e.g. "x56442") using standard dialer pause (comma)
  const [base, ext] = phone.split(/\s*x/i);
  const cleanBase = base ? base.replace(/[^\d+]/g, '') : '';
  const cleanExt = ext ? ext.replace(/[^\d]/g, '') : '';

  if (cleanExt) {
    return `tel:${cleanBase},${cleanExt}`;
  }
  return `tel:${cleanBase || phone.replace(/\s+/g, '')}`;
};

export const getMailtoHref = (email: string): string => {
  return `mailto:${(email || '').trim()}`;
};
