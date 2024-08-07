import { ListPagination } from '@/services/general/data';
import { getLang } from '@/services/general/util';
import { getSourceTable } from '@/services/sources/api';
import { SourceTable } from '@/services/sources/data';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Space, Tooltip } from 'antd';
import type { FC } from 'react';
import { useRef } from 'react';
import { FormattedMessage, useIntl, useLocation } from 'umi';
import SourceCreate from './Components/create';
import SourceDelete from './Components/delete';
import SourceEdit from './Components/edit';
import SourceView from './Components/view';

const TableList: FC = () => {
    const location = useLocation();
    let dataSource = '';
    if (location.pathname.includes('/mydata')) {
        dataSource = 'my';
    } else if (location.pathname.includes('/tgdata')) {
        dataSource = 'tg';
    }
    const { locale } = useIntl();
    const lang = getLang(locale);
    const actionRef = useRef<ActionType>();
    const sourceColumns: ProColumns<SourceTable>[] = [
        {
            title: <FormattedMessage id="source.index" defaultMessage="Index" />,
            dataIndex: 'index',
            valueType: 'index',
            search: false,
        },
        {
            title: <FormattedMessage id="source.shortName" defaultMessage="Data Name" />,
            dataIndex: 'shortName',
            sorter: false,
            render: (_, row) => [
                <Tooltip key={0} placement="topLeft" title={row.shortName}>
                    {row.shortName}
                </Tooltip>,
            ],
        },
        {
            title: <FormattedMessage id="source.classification" defaultMessage="Classification" />,
            dataIndex: 'classification',
            sorter: false,
            search: false,
        },
        // {
        //     title: <FormattedMessage id="source.sourceCitation" defaultMessage="SourceCitation" />,
        //     dataIndex: 'sourceCitation',
        //     sorter: false,
        //     search: false,
        // },
        {
            title: <FormattedMessage id="source.publicationType" defaultMessage="PublicationType" />,
            dataIndex: 'publicationType',
            sorter: true,
            search: false,
        },
        {
            title: <FormattedMessage id="contact.createdAt" defaultMessage="Created At" />,
            dataIndex: 'created_at',
            valueType: 'dateTime',
            sorter: true,
            search: false,
        },
        {
            title: <FormattedMessage id="options.option" defaultMessage="Option" />,
            dataIndex: 'option',
            search: false,
            render: (_, row) => {
                if (dataSource === 'my') {
                    return [
                        <Space size={'small'} key={0}>
                            <SourceView lang={lang} id={row.id} dataSource={dataSource} buttonType={'icon'} actionRef={actionRef} />
                            <SourceEdit
                                id={row.id}
                                lang={lang}
                                buttonType={'icon'}
                                actionRef={actionRef}
                                setViewDrawerVisible={() => { }}
                            />
                            <SourceDelete
                                id={row.id}
                                buttonType={'icon'}
                                actionRef={actionRef}
                                setViewDrawerVisible={() => { }}
                            />
                        </Space>,
                    ];
                }
                return [
                    <Space size={'small'} key={0}>
                        <SourceView lang={lang} id={row.id} dataSource={dataSource} buttonType={'icon'} actionRef={actionRef} />
                    </Space>,
                ];
            },
        },
    ];
    return (
        <PageContainer>
            <ProTable<SourceTable, ListPagination>
                actionRef={actionRef}
                search={{
                    defaultCollapsed: false,
                }}
                pagination={{
                    showSizeChanger: false,
                    pageSize: 10,
                }}
                toolBarRender={() => {
                    if (dataSource === 'my') {
                        return [<SourceCreate lang={lang} key={0} actionRef={actionRef} />];
                    }
                    return [];
                }}
                request={async (
                    params: {
                        pageSize: number;
                        current: number;
                    },
                    sort,
                ) => {
                    return getSourceTable(params, sort, lang, dataSource);
                }}
                columns={sourceColumns}
            />
        </PageContainer>
    );
};

export default TableList;
