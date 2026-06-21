"use server";

import { db } from "@/server/lib/supabase";
import { revalidatePath } from "next/cache";

const AVATAR_BUCKET = "avatars";
const PORTFOLIO_BUCKET = "portfolio";
const SERVICE_IMAGES_BUCKET = "service-images";

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(formData: FormData): Promise<UploadResult> {
  try {
    const supabase = await db();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 5MB" };
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

    // Update profile
    await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    revalidatePath("/dashboard");

    return { success: true, url: publicUrl, path: filePath };
  } catch (error) {
    console.error("Avatar upload failed:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Upload portfolio image
 */
export async function uploadPortfolioImage(
  formData: FormData
): Promise<UploadResult> {
  try {
    const supabase = await db();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 10MB" };
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/portfolio-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(PORTFOLIO_BUCKET)
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(filePath);

    return { success: true, url: publicUrl, path: filePath };
  } catch (error) {
    console.error("Portfolio upload failed:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Upload service image
 */
export async function uploadServiceImage(
  formData: FormData
): Promise<UploadResult> {
  try {
    const supabase = await db();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 10MB" };
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/service-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(SERVICE_IMAGES_BUCKET)
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(SERVICE_IMAGES_BUCKET).getPublicUrl(filePath);

    return { success: true, url: publicUrl, path: filePath };
  } catch (error) {
    console.error("Service image upload failed:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(bucket: string, path: string) {
  try {
    const supabase = await db();
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
