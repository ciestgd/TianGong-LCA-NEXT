import LangTextItemFrom from '@/components/LangTextItem/from';
import LevelTextItemFrom from '@/components/LevelTextItem/from';
import SourceSelectFrom from '@/pages/Sources/Components/select/from';
import { ListPagination } from '@/services/general/data';
import { createUnitGroup } from '@/services/unitgroups/api';
import { UnitTable } from '@/services/unitgroups/data';
import styles from '@/style/custom.less';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  Button,
  Card,
  DatePicker,
  Drawer,
  Form,
  Input,
  Space,
  Tooltip,
  Typography,
  message
} from 'antd';
import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'umi';
import UnitCreate from './Unit/create';
import UnitDelete from './Unit/delete';
import UnitEdit from './Unit/edit';

type Props = {
  lang: string;
  actionRef: React.MutableRefObject<ActionType | undefined>;
};
const UnitGroupCreate: FC<Props> = ({ lang, actionRef }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const formRefCreate = useRef<ProFormInstance>();
  const [activeTabKey, setActiveTabKey] = useState<string>('unitGroupInformation');
  const [fromData, setFromData] = useState<any>({});
  const [unitDataSource, setUnitDataSource] = useState<any>([]);

  const actionRefUnitTable = useRef<ActionType>();

  const reload = useCallback(() => {
    actionRef.current?.reload();
  }, [actionRef]);


  const handletUnitDataCreate = (data: any) => {
    setUnitDataSource([
      ...unitDataSource,
      { ...data, '@dataSetInternalID': unitDataSource.length.toString() },
    ]);
  };

  const handletFromData = (data: any) => {
    // setFromData({ ...fromData, data });
  };

  const handletUnitData = (data: any) => {
    setUnitDataSource([...data]);
  };

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const unitColumns: ProColumns<UnitTable>[] = [
    {
      title: <FormattedMessage id="pages.table.index" defaultMessage="Index"></FormattedMessage>,
      valueType: 'index',
      search: false,
    },
    // {
    //   title: <FormattedMessage id="pages.unitgroup.unit.dataSetInternalID" defaultMessage="DataSet Internal ID"></FormattedMessage>,
    //   dataIndex: '@dataSetInternalID',
    //   search: false,
    // },
    {
      title: <FormattedMessage id="pages.unitgroup.unit.name" defaultMessage="Name"></FormattedMessage>,
      dataIndex: 'name',
      search: false,
    },
    {
      title: <FormattedMessage id="pages.unitgroup.unit.meanValue" defaultMessage="Mean Value"></FormattedMessage>,
      dataIndex: 'meanValue',
      search: false,
    },
    {
      title: <FormattedMessage id="pages.unitgroup.unit.selected" defaultMessage="Selected"></FormattedMessage>,
      dataIndex: 'selected',
      valueType: 'switch',
      search: false,
    },
    {
      title: <FormattedMessage id="pages.table.option" defaultMessage="Option"></FormattedMessage>,
      valueType: 'option',
      search: false,
      render: (_, row) => {
        return [
          <Space size={'small'} key={0}>
            <UnitEdit
              id={row.dataSetInternalID}
              data={unitDataSource}
              buttonType={'icon'}
              actionRef={actionRefUnitTable}
              onData={handletUnitData}
              setViewDrawerVisible={() => { }}
            />
            <UnitDelete
              id={row.dataSetInternalID}
              data={unitDataSource}
              buttonType={'icon'}
              actionRef={actionRefUnitTable}
              setViewDrawerVisible={() => { }}
              onData={handletUnitData}
            />
          </Space>
        ];
      }
    },
  ];

  const tabList = [
    { key: 'unitGroupInformation', tab: 'UnitGroup Information' },
    { key: 'modellingAndValidation', tab: 'Modelling And Validation' },
    { key: 'administrativeInformation', tab: 'Administrative Information' },
    { key: 'units', tab: 'Units' },
  ];

  const contentList: Record<string, React.ReactNode> = {
    unitGroupInformation: (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card size="small" title={'Name'}>
          <LangTextItemFrom name={['unitGroupInformation', 'dataSetInformation', 'common:name']} label="Name" />
        </Card>
        <Card size="small" title={'Classification'}>
          <LevelTextItemFrom name={['unitGroupInformation', 'dataSetInformation', "classificationInformation", 'common:classification', 'common:class']} dataType={'UnitGroup'} formRef={formRefCreate} onData={handletFromData} />
        </Card>
        <Form.Item label="Reference To Reference Unit" name={['unitGroupInformation', 'quantitativeReference', 'referenceToReferenceUnit']}>
          <Input />
        </Form.Item>
      </Space>
    ),
    modellingAndValidation: (
      <Space direction="vertical" style={{ width: '100%' }}>
        <SourceSelectFrom
          name={['modellingAndValidation', 'complianceDeclarations', 'compliance', 'common:referenceToComplianceSystem']}
          label={"Reference To Compliance System"}
          lang={lang}
          formRef={formRefCreate} />
        <Form.Item label="Approval Of Overall Compliance" name={['modellingAndValidation', 'complianceDeclarations', 'compliance', 'common:approvalOfOverallCompliance']}>
          <Input />
        </Form.Item>
      </Space>
    ),
    administrativeInformation: (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Form.Item label="TimeStamp" name={['administrativeInformation', 'dataEntryBy', 'common:timeStamp']}>
          <DatePicker showTime></DatePicker>
        </Form.Item>
        <SourceSelectFrom
          name={['administrativeInformation', 'dataEntryBy', 'common:referenceToDataSetFormat']}
          label={'Reference To DataSet Format'}
          lang={lang}
          formRef={formRefCreate} />
        <Form.Item label="DataSet Version" name={['administrativeInformation', 'publicationAndOwnership', 'common:dataSetVersion']}>
          <Input />
        </Form.Item>
      </Space>
    ),
    units: (
      <ProTable<UnitTable, ListPagination>
        actionRef={actionRefUnitTable}
        search={{
          defaultCollapsed: false,
        }}
        pagination={{
          showSizeChanger: false,
          pageSize: 10,
        }}
        toolBarRender={() => {
          return [<UnitCreate key={0} onData={handletUnitDataCreate}></UnitCreate>];
        }}
        dataSource={unitDataSource}
        columns={unitColumns}
      />
    ),
  };

  useEffect(() => {
    if (drawerVisible === false) return;
    formRefCreate.current?.resetFields();
    formRefCreate.current?.setFieldsValue({});
    setUnitDataSource([]);
  }, [drawerVisible]);

  useEffect(() => {
    setFromData({ ...fromData, units: { unit: unitDataSource } });
  }, [unitDataSource]);

  useEffect(() => {
    if (activeTabKey === 'units') return;
    setFromData({
      ...fromData,
      [activeTabKey]: formRefCreate.current?.getFieldsValue()?.[activeTabKey] ?? {},
    });
  }, [formRefCreate.current?.getFieldsValue()]);

  return (
    <>
      <Tooltip title={<FormattedMessage id="pages.table.option.create" defaultMessage="Create"></FormattedMessage>}>
        <Button
          size={'middle'}
          type="text"
          icon={<PlusOutlined />}
          onClick={() => {
            setDrawerVisible(true);
          }}
        ></Button>
      </Tooltip>
      <Drawer
        title={<FormattedMessage id="pages.unitgroup.drawer.title.create" defaultMessage="Create"></FormattedMessage>}
        width="90%"
        closable={false}
        extra={
          <Button
            icon={<CloseOutlined />}
            style={{ border: 0 }}
            onClick={() => {
              setDrawerVisible(false);
            }}
          ></Button>
        }
        maskClosable={false}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
        }}
        footer={
          <Space size={'middle'} className={styles.footer_right}>
            <Button onClick={() => {
              setDrawerVisible(false);
            }}>
              <FormattedMessage id="pages.table.option.cancel" defaultMessage="Cancel"></FormattedMessage>
            </Button>
            <Button onClick={() => {
              formRefCreate.current?.submit();
            }} type="primary">
              <FormattedMessage id="pages.table.option.submit" defaultMessage="Submit"></FormattedMessage>
            </Button>
          </Space>
        }
      >
        <ProForm
          formRef={formRefCreate}
          onValuesChange={(_, allValues) => {
            setFromData({ ...fromData, [activeTabKey]: allValues[activeTabKey] ?? {} });
          }}
          submitter={{
            render: () => {
              return [];
            },
          }}
          onFinish={async () => {
            const result = await createUnitGroup({ ...fromData });
            if (result.data) {
              message.success(
                <FormattedMessage
                  id="options.createsuccess"
                  defaultMessage="Created Successfully!"
                ></FormattedMessage>,
              );
              formRefCreate.current?.resetFields();
              setDrawerVisible(false);
              reload();
            } else {
              message.error(result.error.message);
            }
            return true;
          }}
        >
          <Card
            style={{ width: '100%' }}
            tabList={tabList}
            activeTabKey={activeTabKey}
            onTabChange={onTabChange}
          >
            {contentList[activeTabKey]}
          </Card>
        </ProForm>
        <Typography>
          <pre>{JSON.stringify(fromData, null, 2)}</pre>
        </Typography>
      </Drawer>
    </>
  );
};

export default UnitGroupCreate;
