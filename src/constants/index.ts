import { Preset, SqlPresets } from '@types';

export const formatters: string[] = ['default'];
export const DbtConfig: Preset = {
  dbtControl: ['and', 'as', 'else', 'if', 'in', 'import', 'not', 'or', 'recursive'],
  topLevelWords: ['macro', 'endmacro', 'snapshot', 'endsnapshot'],
  singleLineWords: ['set'],
  startMarkers: ['set', 'block', 'filter', 'for', 'if', 'macro', 'raw', 'call', 'snapshot'],
  endMarkers: ['endblock', 'endfilter', 'endfor', 'endif', 'endmacro', 'endraw', 'endcall', 'endsnapshot'],
  doubleLineMarkers: ['endcall', 'endif', 'endmacro', 'endfor', 'endsnapshot'],
};

export const presets: SqlPresets = {
  reservedWords: {
    // prettier-ignore
    default: ['A', 'ABS', 'ACCESSIBLE', 'ACOS', 'ACOSH', 'ADD_MONTHS', 'AGENT',
      'AGGREGATE', 'ALL', 'ALTER', 'ANY', 'ANY_VALUE',
      'APPROXIMATE_JACCARD_INDEX', 'APPROXIMATE_SIMILARITY',
      'APPROX_COUNT_DISTINCT', 'APPROX_PERCENTILE',
      'APPROX_PERCENTILE_ACCUMULATE', 'APPROX_PERCENTILE_COMBINE',
      'APPROX_PERCENTILE_ESTIMATE', 'APPROX_TOP_K',
      'APPROX_TOP_K_ACCUMULATE', 'APPROX_TOP_K_COMBINE',
      'APPROX_TOP_K_ESTIMATE', 'ARRAY', 'ARRAYS_OVERLAP', 'ARRAY_AGG',
      'ARRAY_APPEND', 'ARRAY_CAT', 'ARRAY_COMPACT', 'ARRAY_CONSTRUCT',
      'ARRAY_CONSTRUCT_COMPACT', 'ARRAY_CONTAINS', 'ARRAY_INSERT',
      'ARRAY_POSITION', 'ARRAY_PREPEND', 'ARRAY_SIZE', 'ARRAY_SLICE',
      'ARRAY_TO_STRING', 'AS', 'ASC', 'ASCII', 'ASIN', 'ASINH',
      'AS_ARRAY', 'AS_BINARY', 'AS_BOOLEAN', 'AS_CHAR', 'AS_DATE',
      'AS_DECIMAL', 'AS_DOUBLE', 'AS_INTEGER', 'AS_NUMBER', 'AS_OBJECT',
      'AS_REAL', 'AS_TIME', 'AS_VARCHAR', 'AT', 'ATAN', 'ATAN2', 'ATANH',
      'ATTRIBUTE', 'AUTHID', 'AUTOMATIC_CLUSTERING_HIST', 'AVG',
      'BASE64_DECODE_BINARY', 'BASE64_DECODE_STRING', 'BASE64_ENCODE',
      'BETWEEN', 'BFILE_BASE', 'BINARY', 'BINARY_INTEGER', 'BITAND',
      'BITAND_AGG', 'BITNOT', 'BITOR', 'BITOR_AGG', 'BITSHIFTLEFT',
      'BITSHIFTRIGHT', 'BITXOR', 'BITXOR_AGG', 'BIT_LENGTH', 'BLOB_BASE',
      'BLOCK', 'BODY', 'BOOLAND', 'BOOLEAN', 'BOOLNOT', 'BOOLOR',
      'BOOLXOR', 'BOTH', 'BOUND', 'BULK', 'BY', 'BYTE', 'C', 'CALL',
      'CALLING', 'CASCADE', 'CASE', 'CAST', 'CBRT', 'CEIL', 'CHAR',
      'CHARACTER', 'CHARINDEX', 'CHARSET', 'CHARSETFORM', 'CHARSETID',
      'CHAR_BASE', 'CHECK', 'CHECK_JSON', 'CHECK_XML', 'CHR',
      'CLOB_BASE', 'CLONE', 'CLOSE', 'CLUSTER', 'CLUSTERS', 'COALESCE',
      'COLAUTH', 'COLLATE', 'COLLATION', 'COLLECT', 'COLUMNS', 'COMMENT',
      'COMMIT', 'COMMITTED', 'COMPILED', 'COMPRESS', 'CONCAT', 'CONNECT',
      'CONSTANT', 'CONSTRUCTOR', 'CONTAINS', 'CONTEXT', 'CONTINUE',
      'CONVERT', 'CONVERT_TIMEZONE', 'COPY_HISTORY', 'CORR', 'COS',
      'COSH', 'COT', 'COUNT', 'COVAR_POP', 'COVAR_SAMP', 'CRASH',
      'CREATE', 'CREDENTIAL', 'CUME_DIST', 'CURRENT', 'CURRENT_ACCOUNT',
      'CURRENT_CLIENT', 'CURRENT_DATABASE', 'CURRENT_DATE',
      'CURRENT_ROLE', 'CURRENT_SCHEMA', 'CURRENT_SCHEMAS',
      'CURRENT_SESSION', 'CURRENT_STATEMENT', 'CURRENT_TIME',
      'CURRENT_TIMESTAMP', 'CURRENT_TRANSACTION', 'CURRENT_USER',
      'CURRENT_VERSION', 'CURRENT_WAREHOUSE', 'CURRVAL', 'CURSOR',
      'CUSTOMDATUM', 'DANGLING', 'DATA', 'DATABASE_STORAGE_USAGE_HI',
      'DATA_TRANSFER_HISTORY', 'DATE', 'DATEADD', 'DATEDIFF',
      'DATE_BASE', 'DATE_FROM_PARTS', 'DATE_PART', 'DATE_TRUNC', 'DAY',
      'DAYNAME', 'DECIMAL', 'DECODE', 'DECOMPRESS_BINARY',
      'DECOMPRESS_STRING', 'DEFAULT', 'DEFINE', 'DEGREES',
      'DENSE_RANK', 'DESC', 'DETERMINISTIC', 'DIRECTORY', 'DISTINCT',
      'DO', 'DOUBLE', 'DROP', 'DURATION', 'EDITDISTANCE', 'ELEMENT',
      'ELSIF', 'EMPTY', 'ENDSWITH', 'EQUAL_NULL', 'ESCAPE', 'EXCEPTIONS',
      'EXCLUSIVE', 'EXECUTE', 'EXISTS', 'EXIT', 'EXP', 'EXTENDS',
      'EXTERNAL', 'EXTERNAL_TABLE_FILES', 'EXTERNAL_TABLE_FILE_REGIS',
      'EXTRACT', 'FACTORIAL', 'FALSE', 'FETCH', 'FINAL', 'FIRST',
      'FIRST_VALUE', 'FIXED', 'FLATTEN', 'FLOAT', 'FLOOR', 'FOR',
      'FORALL', 'FORCE', 'FUNCTION', 'GENERAL', 'GENERATOR',
      'GET', 'GET_DDL', 'GET_OBJECT_REFERENCES', 'GET_PATH , :', 'GOTO',
      'GRANT', 'GREATEST', 'GROUP', 'GROUPING', 'GROUPING_ID', 'HASH',
      'HASH_AGG', 'HAVERSINE', 'HEAP', 'HEX_DECODE_BINARY',
      'HEX_DECODE_STRING', 'HEX_ENCODE', 'HIDDEN', 'HLL',
      'HLL_ACCUMULATE', 'HLL_COMBINE', 'HLL_ESTIMATE', 'HLL_EXPORT',
      'HLL_IMPORT', 'HOUR', 'IDENTIFIED', 'IF', 'IFF', 'IFNULL', 'ILIKE',
      'IMMEDIATE', 'IN', 'INCLUDING', 'INDEX', 'INDEXES', 'INDICATOR',
      'INDICES', 'INFINITE', 'INITCAP', 'INSTANTIABLE', 'INT',
      'INTEGER', 'INTERFACE', 'INTERVAL', 'INTO', 'INVALIDATE', 'IS',
      'IS DISTINCT FROM', 'IS NOT DISTINCT FROM', 'IS NOT NULL',
      'IS NULL', 'ISOLATION', 'IS_ARRAY', 'IS_BINARY', 'IS_BOOLEAN',
      'IS_CHAR', 'IS_DATE', 'IS_DATE_VALUE', 'IS_DECIMAL', 'IS_DOUBLE',
      'IS_INTEGER', 'IS_NULL_VALUE', 'IS_OBJECT', 'IS_REAL', 'IS_TIME',
      'IS_VARCHAR', 'JAVA', 'LAG', 'LANGUAGE', 'LARGE', 'LAST_DAY',
      'LAST_QUERY_ID', 'LAST_TRANSACTION', 'LAST_VALUE', 'LEAD',
      'LEADING', 'LEAST', 'LEFT', 'LENGTH', 'LEVEL', 'LIBRARY', 'LIKE',
      'LIKE ANY', 'LIKE2', 'LIKE4', 'LIKEC', 'LIMITED', 'LISTAGG', 'LN',
      'LOCAL', 'LOCALTIME', 'LOCALTIMESTAMP', 'LOCK', 'LOG',
      'LOGIN_HISTORY', 'LOGIN_HISTORY_BY_USER', 'LONG', 'LOWER', 'LPAD',
      'LTRIM', 'MAP', 'MATERIALIZED_VIEW_REFRESH_HISTORY', 'MAX',
      'MAXLEN', 'MD5', 'MD5_BINARY', 'MD5_HEX', 'MEDIAN', 'MEMBER',
      'MERGE', 'MIN', 'MINHASH', 'MINHASH_COMBINE', 'MINUS', 'MINUTE',
      'MLSLABEL', 'MOD', 'MODE', 'MONTH', 'MONTHNAME', 'MULTISET',
      'NAME', 'NAN', 'NATIONAL', 'NATIVE', 'NATURAL', 'NATURALN',
      'NCHAR', 'NEW', 'NEXTVAL', 'NEXT_DAY', 'NOCOMPRESS', 'NOCOPY',
      'NORMAL', 'NOT', 'NOT BETWEEN', 'NOT IN', 'NOWAIT', 'NTH_VALUE',
      'NTILE', 'NULL', 'NULLIF', 'NUMBER', 'NUMBER_BASE', 'NVL', 'NVL2',
      'OBJECT', 'OBJECT_AGG', 'OBJECT_CONSTRUCT', 'OBJECT_DELETE',
      'OBJECT_INSERT', 'OCICOLL', 'OCIDATE', 'OCIDATETIME',
      'OCIDURATION', 'OCIINTERVAL', 'OCILOBLOCATOR', 'OCINUMBER',
      'OCIRAW', 'OCIREF', 'OCIREFCURSOR', 'OCIROWID', 'OCISTRING',
      'OCITYPE', 'OCTET_LENGTH', 'OF', 'OLD', 'ONLY', 'OPAQUE',
      'OPEN', 'OPERATOR', 'OPTION', 'ORACLE', 'ORADATA', 'ORDER',
      'ORGANIZATION', 'ORLANY', 'ORLVARY', 'OTHERS', 'OUT', 'OVERLAPS',
      'OVERRIDING', 'PACKAGE', 'PARALLEL_ENABLE', 'PARAMETER',
      'PARAMETERS', 'PARENT', 'PARSE_IP', 'PARSE_JSON', 'PARSE_URL',
      'PARSE_XML', 'PARTITION', 'PASCAL', 'PCTFREE', 'PERCENTILE_CONT',
      'PERCENTILE_DISC', 'PERCENT_RANK', 'PI', 'PIPE', 'PIPELINED',
      'PIPE_USAGE_HISTORY', 'PLS_INTEGER', 'PLUGGABLE', 'POSITION',
      'POSITIVE', 'POSITIVEN', 'POW, POWER', 'PRAGMA', 'PRECISION',
      'PREVIOUS_DAY', 'PRIOR', 'PRIVATE', 'PROCEDURE', 'PUBLIC',
      'QUERY_HISTORY', 'RADIANS', 'RAISE', 'RANDOM', 'RANDSTR', 'RANGE',
      'RANK', 'RATIO_TO_REPORT', 'RAW', 'READ', 'REAL', 'RECORD',
      'REFERENCE', 'REGEXP', 'REGEXP_COUNT', 'REGEXP_INSTR',
      'REGEXP_LIKE', 'REGEXP_REPLACE', 'REGEXP_SUBSTR', 'REGR_AVGX',
      'REGR_AVGY', 'REGR_COUNT', 'REGR_INTERCEPT', 'REGR_R2',
      'REGR_SLOPE', 'REGR_SXX', 'REGR_SXY', 'REGR_SYY', 'REGR_VALX',
      'REGR_VALY', 'RELEASE', 'RELIES_ON', 'REM', 'REMAINDER', 'RENAME',
      'REPEAT', 'REPLACE', 'RESOURCE', 'RESULT', 'RESULT_CACHE',
      'RESULT_SCAN', 'RETURN', 'RETURNING', 'REVERSE', 'REVOKE', 'RIGHT',
      'RLIKE', 'ROLLBACK', 'ROUND', 'ROW', 'ROWID', 'ROWNUM', 'ROWTYPE',
      'ROW_NUMBER', 'RPAD', 'RTRIM', 'RTRIMMED_LENGTH', 'SAMPLE', 'SAVE',
      'SAVEPOINT', 'SB1', 'SB2', 'SB4', 'SECOND', 'SEGMENT', 'SELF',
      'SEPARATE', 'SEQ1', 'SEQ2', 'SEQ4', 'SEQ8', 'SEQUENCE',
      'SERIALIZABLE', 'SHA1', 'SHA1_BINARY', 'SHA1_HEX', 'SHA2',
      'SHA2_BINARY', 'SHA2_HEX', 'SHARE', 'SHORT', 'SIGN', 'SIN', 'SINH',
      'SIZE', 'SIZE_T', 'SMALLINT', 'SOME', 'SOUNDEX', 'SPACE', 'SPARSE',
      'SPLIT', 'SPLIT_PART', 'SPLIT_TO_TABLE', 'SQL', 'SQLCODE',
      'SQLDATA', 'SQLERRM', 'SQLNAME', 'SQLSTATE', 'SQRT', 'SQUARE',
      'STAGE_STORAGE_USAGE_HISTORY', 'STANDARD', 'START', 'STARTSWITH',
      'STATIC', 'STDDEV', 'STDDEV_POP', 'STDDEV_SAMP', 'STORED', 'STORY',
      'STRING', 'STRIP_NULL_VALUE', 'STRTOK', 'STRTOK_SPLIT_TO_TABLE',
      'STRTOK_TO_ARRAY', 'STRUCT', 'STYLE', 'SUBMULTISET',
      'SUBPARTITION', 'SUBSTITUTABLE', 'SUBSTR', 'SUBSTRING', 'SUBTYPE',
      'SUCCESSFUL', 'SUM', 'SYNONYM', 'SYSDATE', 'TABAUTH', 'TABLE',
      'TAN', 'TANH', 'TASK_DEPENDENTS', 'TASK_HISTORY', 'TDO', 'THE',
      'THEN', 'TIME', 'TIMEADD', 'TIMEDIFF', 'TIMESTAMP', 'TIMESTAMPADD',
      'TIMESTAMPDIFF', 'TIMESTAMP_FROM_PARTS', 'TIMEZONE_ABBR',
      'TIMEZONE_HOUR', 'TIMEZONE_LTZ', 'TIMEZONE_MINUTE', 'TIMEZONE_NTZ',
      'TIMEZONE_REGION', 'TIME_FROM_PARTS', 'TIME_SLICE', 'TO',
      'TO_ARRAY', 'TO_BINARY', 'TO_BOOLEAN', 'TO_CHAR , TO_VARCHAR',
      'TO_DATE', 'TO_DECIMAL', 'TO_DOUBLE', 'TO_JSON', 'TO_NUMBER',
      'TO_NUMERIC', 'TO_OBJECT', 'TO_TIME', 'TO_TIMESTAMP', 'TO_TIMESTAMP_NTZ',
      'TO_TIMESTAMP_LTZ', 'TO_TIMESTAMP_TZ', 'TO_VARIANT', 'TO_XML', 'TRAILING',
      'TRANSACTION', 'TRANSACTIONAL', 'TRANSLATE', 'TRATION_HISTORY', 'TRIGGER',
      'TRIM', 'TRUE', 'TRUNC', 'TRUNCATE',
      'TRUSTED', 'TRY_BASE64_DECODE_BINARY', 'TRY_BASE64_DECODE_STRING',
      'TRY_CAST', 'TRY_HEX_DECODE_BINARY', 'TRY_HEX_DECODE_STRING',
      'TRY_PARSE_JSON', 'TRY_TO_BINARY', 'TRY_TO_BOOLEAN', 'TRY_TO_DATE',
      'TRY_TO_DECIMAL', 'TRY_TO_DECIMAL, TRY_TO_NUMBER', 'TRY_TO_DOUBLE',
      'TRY_TO_NUMBER', 'TRY_TO_NUMERIC', 'TRY_TO_TIME',
      'TRY_TO_TIMESTAMP', 'TRY_TO_TIMESTAMP_NTZ', 'TYPE', 'TYPEOF',
      'UB1', 'UB2', 'UB4', 'UID', 'UNDER', 'UNICODE', 'UNIFORM',
      'UNIQUE', 'UNPLUG', 'UNSIGNED', 'UNTRUSTED', 'UPPER', 'USE',
      'USER', 'USING', 'UUID_STRING', 'VALIDATE', 'VALIST', 'VALUE',
      'VARCHAR', 'VARCHAR2', 'VARIABLE', 'VARIANCE', 'VARIANCE_POP',
      'VARIANCE_SAMP', 'VARRAY', 'VARYING', 'VAR_POP', 'VAR_SAMP',
      'VIEW', 'VIEWS', 'VOID', 'WAREHOUSE_LOAD_HISTORY',
      'WAREHOUSE_METERING_HISTORY', 'WHENEVER', 'WHILE', 'WIDTH_BUCKET',
      'WORK', 'WRAPPED', 'WRITE', 'XMLGET', 'YEAR', 'ZEROIFNULL', 'ZIPF',
      'ZONE', 'LATERAL']
  },
  reservedTopLevelWords: {
    // prettier-ignore
    default: ['ADD', 'ALTER COLUMN', 'ALTER TABLE', 'BEGIN', 'CONNECT BY', 'DECLARE', 'DELETE FROM',
      'DELETE', 'END', 'EXCEPT', 'EXCEPTION', 'FETCH FIRST', 'GROUP BY', 'HAVING',
      'INSERT INTO', 'INSERT', 'INTERSECT', 'LIMIT', 'LOOP', 'MODIFY', 'ORDER BY', 'SELECT',
      'SET CURRENT SCHEMA', 'SET SCHEMA', 'SET', 'START WITH', 'UNION ALL', 'UNION', 'UPDATE',
      'VALUES', 'WHERE', 'WITH', 'FROM']
  },
  reservedNewLineWords: {
    // prettier-ignore
    default: ['AND', 'CROSS APPLY', 'CROSS JOIN', 'ELSE', 'END', 'INNER JOIN', 'JOIN', 'LEFT JOIN',
      'LEFT OUTER JOIN', 'OR', 'OUTER APPLY', 'OUTER JOIN', 'RIGHT JOIN', 'RIGHT OUTER JOIN',
      'WHEN', 'XOR', 'ON']
  },
  stringTypes: {
    default: [`""`, "N''", "''", '``', '[]'],
  },
  openParens: {
    default: ['(', 'CASE'],
  },
  closeParens: {
    default: [')', 'END'],
  },
  indexedPlaceholderTypes: {
    default: ['?'],
  },
  namedPlaceholderTypes: {
    default: ['@', ':'],
  },
  lineCommentTypes: {
    default: ['#', '--', '{#', '#}'],
  },
  specialWordChars: {
    default: [""],
  },
};
