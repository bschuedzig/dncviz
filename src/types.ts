export type DgFrameworkReference = {
    privateAssets: string;
}

export type DgFrameworkReferences = {
    [name: string]: DgFrameworkReference;
}

export type DgProjectReference = {
    projectPath: string;
}

export type DgProjectReferences = {
    [path: string]: DgProjectReference;
}

export type DgFramework = {
    dependencies: any;
    frameworkReferences: DgFrameworkReferences;
}

export type DgFrameworks = {
    "netcoreapp3.1": DgFramework;
}

export type DgProjectRestoreFramework = {
    projectReferences: DgProjectReferences;
}

export type DgProjectRestoreFrameworks = {
    "netcoreapp3.1": DgProjectRestoreFramework;
}

export type DgProjectRestore = {
    frameworks: DgProjectRestoreFrameworks;
}

export type DgProject = {
    version: string;
    restore: DgProjectRestore;
    frameworks: DgFrameworks;
}

export type DgProjects = {
    [name: string]: DgProject;
}

export type DgFile = {
    format: number;
    restore: any;
    projects: DgProjects;
}
