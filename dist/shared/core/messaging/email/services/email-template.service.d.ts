export declare class EmailTemplateService {
    private readonly logger;
    private readonly templateCache;
    private readonly templateDir;
    constructor();
    render(templateName: string, data?: Record<string, any>): Promise<string>;
    private loadTemplate;
    private replaceVariables;
    private getDefaultTemplate;
    clearCache(): void;
    saveTemplate(templateName: string, content: string): Promise<void>;
    listTemplates(): Promise<string[]>;
}
