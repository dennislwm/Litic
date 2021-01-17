import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class HtmlHasLangTest extends Test {
    constructor () {
        super('<html> has [lang] attribute', ' a page doesn\'t specify a lang attribute, a screen reader assumes that the page is in the default language that the user chose when setting up the screen reader.', 'https://web.dev/html-lang-valid/')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser.getUrl())
        const langReport = lighthouse.getReport()['html-has-lang']
        const validLangReport = lighthouse.getReport()['html-lang-valid']

        const hasLang = langReport.score === 1
        const isValidLang = validLangReport.score === 1
        this.isValid = hasLang && isValidLang

        if (!hasLang) {
            this.comment = '<html> tag does not have a lang attribute.'
        } else if (!isValidLang) {
            this.comment = '<html> tag does not have a valid lang attribute.'
        }

        return this.getResult()
    }
}
