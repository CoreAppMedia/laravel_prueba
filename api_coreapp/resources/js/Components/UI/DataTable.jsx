import React from 'react';

export default function DataTable({ columns, data, actions, keyField = 'id' }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-[--color-border-subtle] bg-white shadow-soft">
            <table className="w-full text-left text-sm text-[--color-text-secondary]">
                <thead className="bg-[--color-bg-surface-alt] text-xs uppercase text-[--color-text-muted] border-b border-[--color-border-strong]">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} scope="col" className="px-6 py-4 font-black whitespace-nowrap tracking-wider">
                                {col.header}
                            </th>
                        ))}
                        {actions && (
                            <th scope="col" className="px-6 py-4 font-black text-right relative tracking-wider">
                                Acciones
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-[--color-border-subtle]">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-10 text-center text-[--color-text-muted] italic font-medium">
                                No hay registros para mostrar.
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={row[keyField]} className="hover:bg-slate-50 transition-colors group">
                                {columns.map((col, idx) => (
                                    <td key={idx} className="px-6 py-4 whitespace-nowrap font-medium text-[--color-text-primary]">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-3 items-center opacity-70 group-hover:opacity-100 transition-opacity">
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
