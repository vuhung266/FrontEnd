import React from 'react';
import { Card, Popconfirm, Button, message, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import * as menuServices from '~/services/menuService';
import 'swiper/css';
const { Meta } = Card;
const SwiperHDSD = ({ dataSlideHDSD, ...props }) => {
    const confirmDelete = (e) => {
        deleteMenuItem(e.id);
        //dataSlideHDSD = dataSlideHDSD.filter((item) => item.id !== e.id);
        console.log(dataSlideHDSD);
        props.actionDelete(e);
    };
    async function deleteMenuItem(id) {
        await menuServices.deleteItemHDSD(id);
        message.info(`Xóa thành công`);
    }
    return (
        <Swiper
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={3}
            className="mycustomswiper"
        >
            {dataSlideHDSD.map((e) => {
                const randomNumber = Math.floor(Math.random() * 100);
                return (
                    <SwiperSlide key={e.id}>
                        Stepssss: {e.step}
                        <Space wrap>
                            <Popconfirm
                                placement="top"
                                title="Xóa nội dung"
                                description="Bạn chắc muốn xóa step này chứ?"
                                onConfirm={() => confirmDelete(e)}
                                okText="Xác nhận xóa"
                                cancelText="Không"
                            >
                                <Button shape="circle" icon={<DeleteOutlined />} size="small" />
                            </Popconfirm>
                            <Popconfirm
                                placement="top"
                                title="Sửa nội dung"
                                description="Bạn chắc muốn xóa step này chứ?"
                                onConfirm={() => confirmDelete(e)}
                                okText="Xác nhận xóa"
                                cancelText="Không"
                            >
                                <Button shape="circle" icon={<EditOutlined />} size="small" />
                            </Popconfirm>
                        </Space>
                        <Card
                            hoverable
                            style={{ width: 240 }}
                            cover={<img alt="example" src={`https://picsum.photos/240/300?random=${randomNumber}`} />}
                        >
                            <Meta title={e.name} description={e.desc} />
                        </Card>
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
};

export default SwiperHDSD;
