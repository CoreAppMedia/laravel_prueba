import React from 'react';

export default function DataTable({ columns, data, actions, keyField = 'id' }) {
    return (
        <div
            className="ui-table"
            style={{
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-soft)',
                width: '100%',
                minWidth: '800px',
            }}
        >
            <table
                className="ui-table__table"
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                }}
            >

                <thead>
                    <tr
                        className="ui-table__headRow"
                        style={{
                            background: 'var(--color-bg-surface-alt)',
                            borderBottom: '2px solid var(--color-border-subtle)',
                        }}
                    >
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className="ui-table__th"
                                style={{
                                    padding: '11px 20px',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 10,
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1.5px',
                                    color: 'var(--color-text-muted)',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {col.header}
                            </th>
                        ))}
                        {actions && (
                            <th
                                className="ui-table__th ui-table__th--actions"
                                style={{
                                    padding: '11px 20px',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 10,
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1.5px',
                                    color: 'var(--color-text-muted)',
                                    textAlign: 'right',
                                }}
                            >
                                Acciones
                            </th>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (actions ? 1 : 0)}
                                className="ui-table__empty"
                                style={{
                                    padding: '48px 24px',
                                    textAlign: 'center',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 13,
                                    color: 'var(--color-text-ghost)',
                                }}
                            >
                                No hay registros para mostrar.
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIdx) => (
                            <tr
                                key={row[keyField]}
                                className="ui-table__row"
                                style={{
                                    borderBottom: rowIdx < data.length - 1
                                        ? '1px solid var(--color-border-subtle)'
                                        : 'none',
                                    transition: 'background 0.15s',
                                    cursor: 'default',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-surface-alt)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                {columns.map((col, idx) => (
                                    <td
                                        key={idx}
                                        className="ui-table__td"
                                        data-label={col.header}
                                        style={{
                                            padding: '13px 20px',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: 13,
                                            fontWeight: 500,
                                            color: 'var(--color-text-primary)',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                                {actions && (
                                    <td
                                        className="ui-table__td ui-table__td--actions"
                                        data-label="Acciones"
                                        style={{
                                            padding: '13px 20px',
                                            textAlign: 'right',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        <div
                                            className="ui-table__actions"
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                gap: 8,
                                            }}
                                        >
                                            {actions(row)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}