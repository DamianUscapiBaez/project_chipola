import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import Logo from '../../assets/logo.png';
export const RegistrosFechasPdf = ({ dataRegister, data }) => {
    const styles = StyleSheet.create({
        body: {
            paddingBottom: 50,
            paddingHorizontal: 20,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold'
        },
        author: {
            fontSize: 12,
            textAlign: 'center',
            marginBottom: 40,
        },
        subtitle: {
            fontSize: 18,
            margin: 12,
            fontFamily: 'Oswald'
        },
        text: {
            margin: 12,
            fontSize: 14,
            textAlign: 'justify',
            fontFamily: 'Times-Roman'
        },
        image: {
            marginVertical: 10,
            marginHorizontal: 50,
            width: '45px',
            height: '45px'
        },
        header: {
            fontSize: 12,
            marginBottom: 20,
            textAlign: 'center',
            color: 'grey',
        },
        pageNumber: {
            position: 'absolute',
            fontSize: 8,
            bottom: 30,
            left: 0,
            right: 40,
            textAlign: 'right',
            color: 'grey',
        },
    });
    const estilosTablaPdf = { padding: "4px 0" }
    return (
        <Document>
            <Page style={styles.body} orientation="landscape" size={"A3"}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }} fixed>
                    <View>
                        <Image style={{ width: '60px', height: '60px' }} src={Logo} />
                    </View>
                    <View style={{ marginLeft: '20px' }}>
                        <Text style={{ fontSize: '16px' }}>CHIPOLA</Text>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        <Text style={{ fontSize: '16px' }}>
                            REPORTE {dataRegister.type === "F" ? 'FACTURAS ' : 'BOLETAS '}
                            POR FECHAS
                        </Text>
                        <Text style={{ fontSize: '12px', marginLeft: 'auto', marginTop: '5px' }}>
                            {dataRegister.fechainicio.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')} - {dataRegister.fechafinal.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}
                        </Text>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', color: '#fff', backgroundColor: "#2a8038", paddingTop: "5px", paddingBottom: '5px' }} fixed>
                    <View style={{ display: 1, width: '5px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}></Text>
                    </View>
                    <View style={{ display: 2, width: '100px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}>NUMERO</Text>
                    </View>
                    <View style={{ display: 3, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}>FECHA</Text>
                    </View>
                    <View style={{ display: 4, width: '250px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}>CLIENTE</Text>
                    </View>
                    <View style={{ display: 5, width: '250px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}>NOMBRE COMERCIAL</Text>
                    </View>
                    <View style={{ display: 6, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>KILOS</Text>
                    </View>
                    <View style={{ display: 7, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>MONTO</Text>
                    </View>
                    <View style={{ display: 8, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}>FECHA PAGO</Text>
                    </View>
                    <View style={{ display: 9, width: '150px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}>NUMERO OPERACION</Text>
                    </View>
                    <View style={{ display: 10, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>MONTO PAGO</Text>
                    </View>
                    <View style={{ display: 11, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}>FECHA PAGO 2</Text>
                    </View>
                    <View style={{ display: 12, width: '150px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}>NUMERO OPERACION 2</Text>
                    </View>
                    <View style={{ display: 13, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>MONTO PAGO 2</Text>
                    </View>
                    <View style={{ display: 14, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>ESTADO</Text>
                    </View>
                    <View style={{ display: 15, width: '5px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}></Text>
                    </View>
                </View>
                {
                    data.map((d, index) => (
                        <View key={index} style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#EBF8FF', padding: estilosTablaPdf.padding }}>
                            <View style={{ display: 1, width: '5px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}></Text>
                            </View>
                            <View style={{ display: 2, width: '100px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}>{d.numero}</Text>
                            </View>
                            <View style={{ display: 3, width: '70px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}>{d.fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}</Text>
                            </View>
                            <View style={{ display: 4, width: '250px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}>{d.cliente}</Text>
                            </View>
                            <View style={{ display: 5, width: '250px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}>{d.tradename}</Text>
                            </View>
                            <View style={{ display: 6, width: '70px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{d.kilos}</Text>
                            </View>
                            <View style={{ display: 7, width: '70px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{d.monto}</Text>
                            </View>
                            <View style={{ display: 8, width: '70px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}>{d.fechapago !== null ? d.fechapago.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1') : ''}</Text>
                            </View>
                            <View style={{ display: 9, width: '150px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}>{d.numeroperacion}</Text>
                            </View>
                            <View style={{ display: 10, width: '70px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{d.montopago}</Text>
                            </View>
                            <View style={{ display: 11, width: '70px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}>{d.fechapago2 !== null ? d.fechapago2.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1') : ''}</Text>
                            </View>
                            <View style={{ display: 12, width: '150px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}>{d.numeroperacion2}</Text>
                            </View>
                            <View style={{ display: 13, width: '70px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{d.montopago2}</Text>
                            </View>
                            <View style={{ display: 14, width: '70px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>
                                    {d.estado === 'PEN' ? 'PENDIENTE' : ''}
                                    {d.estado === 'ANU' ? 'ANULADO' : ''}
                                    {d.estado === 'PAG' ? 'PAGADO' : ''}
                                </Text>
                            </View>
                            <View style={{ display: 15, width: '5px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}></Text>
                            </View>
                            <br />
                        </View>
                    ))
                }
                <View style={{ display: 'flex', flexDirection: 'row', color: '#fff', backgroundColor: "#2a8038", padding: "4px 0" }} fixed>
                    <View style={{ display: 1, width: '5px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}></Text>
                    </View>
                    <View style={{ display: 2, width: '100px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}>TOTAL</Text>
                    </View>
                    <View style={{ display: 3, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}></Text>
                    </View>
                    <View style={{ display: 4, width: '250px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}></Text>
                    </View>
                    <View style={{ display: 5, width: '250px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}></Text>
                    </View>
                    <View style={{ display: 6, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{data.reduce((total, item) => parseFloat(total) + parseFloat(item.kilos), 0).toFixed(2)}</Text>
                    </View>
                    <View style={{ display: 7, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{data.reduce((total, item) => parseFloat(total) + parseFloat(item.monto), 0).toFixed(2)}</Text>
                    </View>
                    <View style={{ display: 8, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}></Text>
                    </View>
                    <View style={{ display: 9, width: '150px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}></Text>
                    </View>
                    <View style={{ display: 10, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{data.reduce((total, item) => parseFloat(total) + parseFloat(item.montopago), 0).toFixed(2)}</Text>
                    </View>
                    <View style={{ display: 11, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}></Text>
                    </View>
                    <View style={{ display: 12, width: '150px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}></Text>
                    </View>
                    <View style={{ display: 13, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{data.reduce((total, item) => parseFloat(total) + parseFloat(item.montopago2), 0).toFixed(2)}</Text>
                    </View>
                    <View style={{ display: 14, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}></Text>
                    </View>
                    <View style={{ display: 15, width: '5px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}></Text>
                    </View>
                </View>
                <Text style={{ fontSize: 8, left: 40, right: 0, textAlign: 'left', bottom: 30, position: 'absolute', color: 'grey', }} fixed>Fecha: {new Date().toLocaleDateString('es-ES')}</Text>
                <Text style={{ fontSize: 8, left: 130, right: 0, textAlign: 'left', bottom: 30, position: 'absolute', color: 'grey', }} fixed>Hora: {new Date().toLocaleTimeString()}</Text>
                <Text style={styles.pageNumber} render={({ pageNumber }) => (
                    `Pag ${pageNumber}`
                )} fixed />
            </Page>
        </Document>
    );
}