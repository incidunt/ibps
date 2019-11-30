export const statusOptions = [
  {
    value: 'actived',
    label: '激活'
  },
  {
    value: 'disable',
    label: '禁用'
  }
]
export const dbTypeOptions = [
  {
    value: 'mysql',
    label: 'mysql',
    driver: 'com.mysql.jdbc.Driver',
    driverUrl: 'jdbc:mysql://主机:3306/数据库名?useUnicode=true&characterEncoding=utf-8'
  },
  {
    value: 'oracle',
    label: 'oracle',
    driver: 'oracle.jdbc.OracleDriver',
    driverUrl: 'jdbc:oracle:thin:@主机:1521:数据库实例'
  },
  {
    value: 'sqlserver',
    label: 'sqlserver',
    driver: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    driverUrl: 'jdbc:sqlserver://主机:1433;databaseName=数据库名;'
  },
  {
    value: 'postgres',
    label: 'postgres',
    driver: 'org.postgresql.Driver',
    driverUrl: 'jdbc:postgresql://主机:5432/数据库名'
  }
]
