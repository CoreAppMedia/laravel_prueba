import React from 'react';

export default function DataTable({ columns, data, actions, keyField = 'id' }) {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-700/50">
            <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-xs uppercase text-slate-400 border-b border-slate-700/50">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} scope="col" className="px-6 py-4 font-medium whitespace-nowrap">
                                {col.header}
                            </th>
                        ))}
                        {actions && (
                            <th scope="col" className="px-6 py-4 font-medium text-right relative">
                                Acciones
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 bg-slate-800/30">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-8 text-center text-slate-500">
                                No hay registros para mostrar.
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={row[keyField]} className="hover:bg-slate-700/40 transition-colors">
                                {columns.map((col, idx) => (
                                    <td key={idx} className="px-6 py-4 whitespace-nowrap">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-3 items-center">
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
