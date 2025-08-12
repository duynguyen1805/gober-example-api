import en from '../translations/en.json';
import vi from '../translations/vn.json';

export class TranslateMessageCodeService {
  private translations: Record<string, Record<string, string>> = {};
  private defaultLanguage = 'en';

  constructor() {
    this.translations['en'] = en;
    this.translations['vi'] = vi;
  }

  /**
   * Lấy ngôn ngữ json theo accept-language lấy từ header
   * Mặc định "en" nếu accept-language null hoặc empty
   * Chỉ đang áp dụng "vi" và "en", không phải "vi" mặc định chọn "en"
   * @returns {string}: "en" hoặc "vi"
   */
  resolveLang(acceptLang?: string) {
    if (!acceptLang) return this.defaultLanguage;
    const first = acceptLang.split(',')[0].split(';')[0].trim().toLowerCase();
    return first.startsWith('vi') ? 'vi' : 'en';
  }

  /**
   * Lấy thông tin ngôn ngữ json theo key, mặc định "en"
   *
   * @param key - The message code key to be translated.
   * @param acceptLang - Tuỳ chọn ngôn ngữ muốn chuyển
   * @returns {string}: Nội dung ngôn ngữ theo key trong file json
   */

  translateMessageCode(key: string, acceptLang?: string): string | undefined {
    const lang = this.resolveLang(acceptLang);
    return (
      this.translations[lang]?.[key] ??
      this.translations[this.defaultLanguage]?.[key]
    );
  }
}
