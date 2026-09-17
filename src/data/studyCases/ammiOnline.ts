import type { StudyCase } from '../../types';

export const ammiOnlineEs: StudyCase = {
  id: 'ammi-online',
  title: 'AMMI ONLINE // Plataforma Institucional & Gestión Académica',
  vaultPath: '01_PROJECTS/2025_AMMI_Online_Clean_Architecture.md',
  frontmatter: {
    type: 'Case Study / Architecture Record',
    role: 'Líder de Proyecto & Lead Full Stack Engineer',
    status: '#production // #active',
    created: '2025-01-10',
    tags: ['#clean-architecture', '#dotnet8', '#cqrs', '#angular20-ssr', '#postgresql', '#segundo-cerebro', '#enterprise'],
    technologies: ['Angular 20 SSR', '.NET 8 Web API', 'PostgreSQL', 'C#', 'TypeScript', 'PrimeNG 21', 'Tailwind CSS'],
    methodologies: ['Clean Architecture (4 Capas)', 'CQRS & MediatR', 'Server-Side Rendering (SSR)', 'Generación Automatizada de Reportes', 'CORS & Seguridad HTTP'],
    stack: ['Angular 20 SSR', '.NET 8 Web API', 'PostgreSQL', 'C#', 'TypeScript', 'MediatR', 'FluentValidation', 'EF Core 8', 'PrimeNG 21'],
    complexity: 'Alta (Enterprise / Alta Concurrencia)',
    impact: 'Digitalización 100% de procesos y reducción de generación de reportes de 2 semanas a 2 minutos'
  },
  contextAndProblem:
    'Ausencia total de infraestructura digital en la institución. Todos los procesos operativos, admisiones, distributivos y matrículas se gestionaban de forma manual y desarticulada en hojas de cálculo de Excel, documentos de Word dispersos en Google Drive y expedientes físicos en papel, causando pérdidas de información y semanas de retraso en auditorías y reportes.',
  architectureDecision: {
    adrSummary: 'ADR-001: Clean Architecture en 4 Capas + CQRS con MediatR + Angular 20 SSR sobre PostgreSQL',
    diagramAscii: `
+-------------------------------------------------------------------+
|                        PRESENTATION LAYER                         |
|   [ Angular 20 SSR (@angular/ssr) + Express + PrimeNG 21 ]        |
|   [ Client-Side & Server Stream Exporters: xlsx, jspdf ]          |
+----------------------------------+--------------------------------+
                                  | REST / JWT (Bearer Auth) + CORS
                                  v
+-------------------------------------------------------------------+
|                       APPLICATION LAYER (CQRS)                    |
|   +---------------------------+   +---------------------------+   |
|   |    COMMANDS (MediatR)     |   |     QUERIES (MediatR)     |   |
|   | [MatriculaEstudianteCmd]  |   | [GenerarReporteCursoQry]  |   |
|   +-------------+-------------+   +-------------+-------------+   |
|                 |                               |                 |
|                 v                               v                 |
|       [ FluentValidation ]            [ Projection DTOs ]         |
+-----------------+-------------------------------+-----------------+
                  |                               |
                  v                               v
+-------------------------------------------------------------------+
|                          DOMAIN LAYER                             |
|    [ Entities: Estudiante, Matricula, Asignatura, Distributivo ]  |
|    [ ValueObjects: Email, CedulaEcuatoriana, PeriodoAcademico ]   |
|    [ Domain Events: MatriculaConfirmadaDomainEvent ]              |
+---------------------------------+---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                       INFRASTRUCTURE LAYER                        |
|  [ EF Core 8 DbContext ]  <-->  [ PostgreSQL Relational Cluster ] |
|  [ Serilog Structured Telemetry ] <--> [ Audit Logs ]             |
+-------------------------------------------------------------------+`,
    keyPoints: [
      'Separación estricta en 4 capas: Presentation, Application, Domain e Infrastructure.',
      'Patrón CQRS desacoplado mediante MediatR y validación determinista con FluentValidation.',
      'Server-Side Rendering (@angular/ssr) para optimización de carga instantánea y SEO institucional.',
      'Persistencia centralizada en PostgreSQL con índices optimizados para agregaciones y consultas analíticas.',
      'Configuración segura de CORS, autenticación JWT y telemetría estructurada con Serilog.'
    ]
  },
  technicalSolution: {
    overview:
      'Liderazgo y desarrollo del ecosistema completo: modelado de base de datos relacional en PostgreSQL, pipeline CQRS en .NET 8 con MediatR, y frontend reactivo en Angular 20 SSR con componentes PrimeNG y exportación automatizada de reportes.',
    snippets: [
      {
        filename: 'GenerarReporteAcademicoQueryHandler.cs',
        language: 'csharp',
        code: `public class GenerarReporteAcademicoQueryHandler 
    : IRequestHandler<GenerarReporteAcademicoQuery, Result<ReporteConsolidadoDto>>
{
    private readonly IApplicationDbContext _context;

    public GenerarReporteAcademicoQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ReporteConsolidadoDto>> Handle(
        GenerarReporteAcademicoQuery request, 
        CancellationToken cancellationToken)
    {
        // Consulta agregada directa optimizada sobre PostgreSQL
        var consolidado = await _context.Matriculas
            .AsNoTracking()
            .Where(m => m.PeriodoId == request.PeriodoId && m.CursoId == request.CursoId)
            .Select(m => new DetalleReporteDto
            {
                EstudianteId = m.EstudianteId,
                NombreCompleto = m.Estudiante.Apellidos + " " + m.Estudiante.Nombres,
                Cedula = m.Estudiante.Cedula,
                EstadoMatricula = m.Estado.ToString(),
                PromedioGeneral = m.Calificaciones.Average(c => (decimal?)c.NotaFinal) ?? 0
            })
            .ToListAsync(cancellationToken);

        return Result.Success(new ReporteConsolidadoDto(consolidado));
    }
}`
      }
    ]
  },
  challengesAndFixes: [
    {
      challenge: 'Migrar una institución que operaba 100% en hojas de cálculo de Excel dispersas y documentos físicos a un modelo relacional unificado sin interrupción de matrículas.',
      solution: 'Diseño e implementación de un modelo de datos canónico en PostgreSQL con pipelines de validación estricta y Clean Architecture.'
    },
    {
      challenge: 'Tiempos excesivos de consolidación de notas y reportes institucionales (tomaban de 1 a 2 semanas por curso).',
      solution: 'Creación de un motor automatizado de reportes que procesa y genera consolidados oficiales en menos de 2 minutos.'
    }
  ],
  resultsAndSecondBrainLinks: {
    metrics: [
      { label: 'Generación de Reportes', value: '< 2 minutos (antes 1 a 2 semanas)' },
      { label: 'Procesos Digitalizados', value: '100% de la operación académica' },
      { label: 'Consistencia de Datos', value: '0 pérdida de información / PostgreSQL' }
    ],
    backlinks: [
      '[[Clean-Architecture-Guidelines]]',
      '[[CQRS-Event-Driven-Patterns]]',
      '[[Angular-SSR-Performance]]',
      '[[PostgreSQL-Schema-Design]]'
    ],
    conclusion:
      'AMMI Online digitalizó de punta a punta la operación institucional bajo mi liderazgo técnico, reemplazando carpetas físicas y archivos dispersos de Drive por una plataforma de alto rendimiento con reportes automatizados en minutos.'
  },
  callouts: [
    {
      type: 'important',
      title: 'Liderazgo & Impacto de Ingeniería',
      content: 'El proyecto transformó una entidad sin herramientas digitales en una operación moderna con 100% de procesos automatizados y tiempos de auditoría reducidos de semanas a minutos.'
    }
  ]
};

export const ammiOnlineEn: StudyCase = {
  id: 'ammi-online',
  title: 'AMMI ONLINE // Institutional Platform & Academic Suite',
  vaultPath: '01_PROJECTS/2025_AMMI_Online_Clean_Architecture.md',
  frontmatter: {
    type: 'Case Study / Architecture Record',
    role: 'Project Lead & Lead Full Stack Engineer',
    status: '#production // #active',
    created: '2025-01-10',
    tags: ['#clean-architecture', '#dotnet8', '#cqrs', '#angular20-ssr', '#postgresql', '#second-brain', '#enterprise'],
    technologies: ['Angular 20 SSR', '.NET 8 Web API', 'PostgreSQL', 'C#', 'TypeScript', 'PrimeNG 21', 'Tailwind CSS'],
    methodologies: ['Clean Architecture (4 Layers)', 'CQRS & MediatR', 'Server-Side Rendering (SSR)', 'Automated Report Generation', 'CORS & HTTP Security'],
    stack: ['Angular 20 SSR', '.NET 8 Web API', 'PostgreSQL', 'C#', 'TypeScript', 'MediatR', 'FluentValidation', 'EF Core 8', 'PrimeNG 21'],
    complexity: 'High (Enterprise / High Concurrency)',
    impact: '100% process digitalization and report generation time reduced from 2 weeks to 2 minutes'
  },
  contextAndProblem:
    'Complete absence of digital infrastructure in the institution. All operational workflows, admissions, teaching schedules, and grade reporting were managed manually across loose Excel spreadsheets, scattered Google Drive Word files, and physical paper binders, causing recurrent data loss and multi-week auditing delays.',
  architectureDecision: {
    adrSummary: 'ADR-001: 4-Layer Clean Architecture + CQRS via MediatR + Angular 20 SSR on PostgreSQL',
    diagramAscii: `
+-------------------------------------------------------------------+
|                        PRESENTATION LAYER                         |
|   [ Angular 20 SSR (@angular/ssr) + Express + PrimeNG 21 ]        |
|   [ Client-Side & Server Stream Exporters: xlsx, jspdf ]          |
+----------------------------------+--------------------------------+
                                  | REST / JWT (Bearer Auth) + CORS
                                  v
+-------------------------------------------------------------------+
|                       APPLICATION LAYER (CQRS)                    |
|   +---------------------------+   +---------------------------+   |
|   |    COMMANDS (MediatR)     |   |     QUERIES (MediatR)     |   |
|   | [EnrollStudentCmd]        |   | [GenerateCourseReportQry] |   |
|   +-------------+-------------+   +-------------+-------------+   |
|                 |                               |                 |
|                 v                               v                 |
|       [ FluentValidation ]            [ Projection DTOs ]         |
+-----------------+-------------------------------+-----------------+
                  |                               |
                  v                               v
+-------------------------------------------------------------------+
|                          DOMAIN LAYER                             |
|    [ Entities: Student, Enrollment, Subject, WorkloadSchedule ]   |
|    [ ValueObjects: Email, NationalId, AcademicTerm ]              |
|    [ Domain Events: EnrollmentConfirmedDomainEvent ]              |
+---------------------------------+---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                       INFRASTRUCTURE LAYER                        |
|  [ EF Core 8 DbContext ]  <-->  [ PostgreSQL Relational Cluster ] |
|  [ Serilog Structured Telemetry ] <--> [ Audit Logs ]             |
+-------------------------------------------------------------------+`,
    keyPoints: [
      'Strict 4-layer decoupling: Presentation, Application, Domain, and Infrastructure.',
      'CQRS pattern isolated via MediatR and deterministic validation with FluentValidation.',
      'Server-Side Rendering (@angular/ssr) for instant initial render and institutional SEO indexing.',
      'Centralized PostgreSQL persistence with query indexing tuned for heavy aggregated academic reports.',
      'Strict CORS security headers, JWT bearer authentication, and structured logging via Serilog.'
    ]
  },
  technicalSolution: {
    overview:
      'Full-lifecycle technical leadership: modeled the canonical relational schema in PostgreSQL, engineered the .NET 8 CQRS backend pipeline with MediatR, and built the reactive Angular 20 SSR frontend with PrimeNG components and instant report exporters.',
    snippets: [
      {
        filename: 'GenerarReporteAcademicoQueryHandler.cs',
        language: 'csharp',
        code: `public class GenerarReporteAcademicoQueryHandler 
    : IRequestHandler<GenerarReporteAcademicoQuery, Result<ReporteConsolidadoDto>>
{
    private readonly IApplicationDbContext _context;

    public GenerarReporteAcademicoQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ReporteConsolidadoDto>> Handle(
        GenerarReporteAcademicoQuery request, 
        CancellationToken cancellationToken)
    {
        // Direct aggregated query optimized on PostgreSQL
        var consolidado = await _context.Matriculas
            .AsNoTracking()
            .Where(m => m.PeriodoId == request.PeriodoId && m.CursoId == request.CursoId)
            .Select(m => new DetalleReporteDto
            {
                EstudianteId = m.EstudianteId,
                NombreCompleto = m.Estudiante.Apellidos + " " + m.Estudiante.Nombres,
                Cedula = m.Estudiante.Cedula,
                EstadoMatricula = m.Estado.ToString(),
                PromedioGeneral = m.Calificaciones.Average(c => (decimal?)c.NotaFinal) ?? 0
            })
            .ToListAsync(cancellationToken);

        return Result.Success(new ReporteConsolidadoDto(consolidado));
    }
}`
      }
    ]
  },
  challengesAndFixes: [
    {
      challenge: 'Migrating an institution completely reliant on scattered spreadsheets and paper records to a normalized relational architecture without pausing active student enrollment.',
      solution: 'Designed and deployed a canonical PostgreSQL relational schema with strict validation pipelines and Clean Architecture decoupling.'
    },
    {
      challenge: 'Slow, error-prone report generation that required 1 to 2 weeks of manual labor per course.',
      solution: 'Engineered an automated report generation engine that aggregates and exports certified dossiers in under 2 minutes.'
    }
  ],
  resultsAndSecondBrainLinks: {
    metrics: [
      { label: 'Report Generation', value: '< 2 minutes (was 1 to 2 weeks)' },
      { label: 'Digitalized Processes', value: '100% academic operations' },
      { label: 'Data Integrity', value: 'Zero loss / Centralized PostgreSQL' }
    ],
    backlinks: [
      '[[Clean-Architecture-Guidelines]]',
      '[[CQRS-Event-Driven-Patterns]]',
      '[[Angular-SSR-Performance]]',
      '[[PostgreSQL-Schema-Design]]'
    ],
    conclusion:
      'AMMI Online modernized the institution end-to-end under my technical direction, replacing fragile paper files and loose Drive sheets with an enterprise-grade platform that generates certified reports in minutes.'
  },
  callouts: [
    {
      type: 'important',
      title: 'Engineering Leadership & Business Impact',
      content: 'The project converted an organization with zero digital tooling into a high-efficiency automated operation, slashing auditing and reporting turnaround from weeks to 2 minutes.'
    }
  ]
};
