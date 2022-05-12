export interface Project {
    date: {
        since: Date;
        to?: Date;
    };
    onMain?: boolean;
    stack?: {
        /**
         * Program languages (like: NodeJS, Python, Rust)
         */
        languages?: [string, ...string[]];
        /**
         * Frameworks and libs (like: jQuery, Django, React)
         */
        frameworks?: [string, ...string[]];
        /**
         * Technologies, workflow and instruments (like: Git-flow, GitLab CI, Docker)
         */
        technologies?: [string, ...string[]];
    };
    links?: {
        /**
         * Link to project (like: https://github.com/jag-k/projects)
         */
        url?: string;
        /**
         * Link to repository on GitLab (like: https://gitlab.com/jag-k/projects)
         */
        gitlab?: string;
        /**
         * Short link in Github (like: jag-k/projects)
         */
        github?: string;
    };
    name: string,
    company?: string,
    description: string,
    role?: string,
    summary?: string
}
