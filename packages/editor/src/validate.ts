import type { Testimonial, Person } from "@config-driven-testimonials/config-schema";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function isValidUrl(s: string): boolean {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

export function validateAuthor(author: Person): ValidationResult {
  const errors: string[] = [];
  if (author?.linkedinUrl && !isValidUrl(author.linkedinUrl)) errors.push("LinkedIn URL is not a valid URL");
  author?.links?.forEach((link, i) => {
    if (!link.label.trim()) errors.push(`Link ${i + 1}: label is empty`);
    if (!link.url.trim()) errors.push(`Link ${i + 1}: URL is empty`);
    else if (!isValidUrl(link.url)) errors.push(`Link ${i + 1}: URL is not valid`);
  });
  return { valid: errors.length === 0, errors };
}

export function validateTestimonial(t: Testimonial): ValidationResult {
  const errors: string[] = [];

  if (!t.text?.trim()) errors.push("Text is empty");
  if (!t.author?.name?.trim()) errors.push("Author name is empty");
  if (!t.author?.title?.trim()) errors.push("Author title is empty");
  if (!t.relationship?.trim()) errors.push("Relationship is empty");
  if (!t.date?.trim()) errors.push("Date is empty");
  if (!t.associatedRole?.company?.trim()) errors.push("Company is empty");
  if (!t.associatedRole?.period?.trim()) errors.push("Period is empty");

  if (t.author?.linkedinUrl && !isValidUrl(t.author.linkedinUrl)) {
    errors.push("Author LinkedIn URL is not a valid URL");
  }
  if (t.source?.type === "linkedin" && !isValidUrl(t.source.url)) {
    errors.push("Source LinkedIn URL is not a valid URL");
  }
  if (t.recommendationUrl && !isValidUrl(t.recommendationUrl)) {
    errors.push("Recommendation URL is not a valid URL");
  }

  return { valid: errors.length === 0, errors };
}