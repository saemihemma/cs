import { NextRequest, NextResponse } from 'next/server';
import { clearAllCache, clearCategory, getCacheStats, CacheCategories } from '@/lib/cache/manager';

/**
 * GET /api/refresh - Get cache statistics
 */
export async function GET() {
  try {
    const stats = await getCacheStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/refresh - Clear cache
 * Body: { category?: string } - Optional category to clear, or all if not specified
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { category } = body as { category?: string };

    if (category) {
      // Clear specific category
      if (!Object.values(CacheCategories).includes(category as typeof CacheCategories[keyof typeof CacheCategories])) {
        return NextResponse.json(
          { success: false, error: `Invalid category: ${category}` },
          { status: 400 }
        );
      }
      await clearCategory(category);
      return NextResponse.json({
        success: true,
        message: `Cache cleared for category: ${category}`,
      });
    }

    // Clear all cache
    await clearAllCache();
    return NextResponse.json({
      success: true,
      message: 'All cache cleared',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
