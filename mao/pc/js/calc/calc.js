/**
 * Created by hwy on 2016/3/10.
 */
!(function($,root){
    function calc(options){
        var defaults={
            carPrice:239800,//购车款
            specistaxexemption:0,//是否免税
            specistaxrelief:0,//是否减税
            rdImport: 0,//是否进口车
            rdDisplacement:2.0, //默认2.0L 排量
            rdSeatCount:5,//默认6座以下
            rdThirdInsureClaim:100000,//第三者责任险 默认赔付额度10W,
            rdCarBodyInsure:5000,//车身划痕险 默认赔付额度5000,

            txtLicenseTax:500,//自定义上牌费用
            txtUsageTax:0,//自定义车船使用税
            txtPassengerInsurance:50,//自定义车上人员责任险


            rdPrepayment: 0.3, //首付比例 0表示启用自定义首付
            rdLoanYears: 1,//还款年限
            txtPrepayment: 0, //自定义首付
             //商业保险是否勾选，默认全部勾选
            CommInsureCheck:{
                txtThirdInsurance:true,//第三者责任险
                txtDamageInsurance:true,//车辆损失险
                txtStolenInsurance:true,//全车盗抢险
                txtGlassInsurance:true,//玻璃单独破碎险
                txtCombustInsurance:true,//自燃损失险
                txtNoDeductibleInsurance:true,//不计免赔特约险
                txtNoLiabilityInsurance:true,//无过责任险
                txtPassengerInsurance:true,//车上人员责任险
                txtCarBodyInsurance:true//车身划痕险
            }
        };
        //计算公式
        var formula={
            //购置税
            txtPurchaseTax:function(data,opts){
                if(opts.specistaxexemption > 0) {  //是否免税
                    data.txtPurchaseTaxInfo='该车型满足购置税免除条件';
                    return 0;
                }
                if(opts.specistaxrelief > 0){  // 减税 *0.5
                    data.txtPurchaseTaxInfo='购置税＝购车款/(1+17%)×购置税率(10%)x减税(0.5) ';
                    return (opts.carPrice / 1.17) * 0.1*0.5;
                }
                data.txtPurchaseTaxInfo='购置税＝购车款/(1+17%)×购置税率(10%)';
                return (opts.carPrice / 1.17) * 0.1;
            },
            //上牌费用
            txtLicenseTax:function(data,opts){
                return opts.txtLicenseTax;
            },
            //车船使用税
            txtUsageTax:function(data,opts){
                var displacement=opts.rdDisplacement;//排量
                if(opts.txtUsageTax){
                    return opts.txtUsageTax;
                }
                /*各省不统一，以北京为例(单位/年)。
                 1.0L(含)以下300元；
                 1.0-1.6L(含)420元；
                 1.6-2.0L(含)480元；
                 2.0-2.5L(含)900元；
                 2.5-3.0L(含)1920元；
                 3.0-4.0L(含)3480元；
                 4.0L以上5280元；
                 不足一年按当年剩余月算。*/
                if (displacement <= 1.0) {
                    return 300;
                } else if (displacement > 1.0 && displacement <= 1.6) {
                    return 420;
                } else if (displacement > 1.6 && displacement <= 2.0) {
                    return 480
                } else if (displacement > 2.0 && displacement <= 2.5) {
                    return 900
                } else if (displacement > 2.5 && displacement <= 3.0) {
                    return 1920
                } else if (displacement > 3.0 && displacement <= 4.0) {
                    return 3480
                } else if (displacement > 4.0) {
                    return 5280
                }
                return 480;
            },
            //交强险
            txtTrafficInsurance:function(data,opts){
                //家用6座以下950元/年，家用6座及以上1100元/年
                return opts.rdSeatCount<6?950:1100;
            },
            //第三者责任险
            txtThirdInsurance:function(data,opts){
                var thirdInsureClaim = opts.rdThirdInsureClaim;//赔付额度
                var seatCount = opts.rdSeatCount; //座位数
                if (seatCount < 6) {
                    switch (thirdInsureClaim) {
                        case 50000:
                            return 516;
                        case 100000:
                            return 746;
                        case 200000:
                            return 924;
                        case 500000:
                            return 1252;
                        case 1000000:
                            return 1630;
                        default:
                            return 746;
                    }
                } else {
                    switch (thirdInsureClaim) {
                        case 50000:
                            return 478;
                        case 100000:
                            return 674;
                        case 200000:
                            return 821;
                        case 500000:
                            return 1094;
                        case 1000000:
                            return 1425;
                        default:
                            return 674;
                    }
                }
                return 746;
            },
            //车辆损失险
            txtDamageInsurance:function(data,opts) {//基础保费+裸车价格×1.0880%
                var carPrice = opts.carPrice;
                var seatCount = opts.rdSeatCount;  //座位数
                var base = seatCount<6?459:550;
                return base + carPrice * 0.01088;
            },
            //全车盗抢险
            txtStolenInsurance:function(data,opts){
                var carPrice = opts.carPrice;
                var seatCount = opts.rdSeatCount;  //座位数
                if (seatCount >= 6) {
                    return 119 + carPrice * 0.00374;
                } else {
                    return 102 + carPrice * 0.004505;
                }
            },
            //玻璃单独破碎险
            txtGlassInsurance:function(data,opts){
                var carPrice = opts.carPrice;
                var rdImport = opts.rdImport;
                return carPrice * (rdImport==1?0.0025:0.0015);
            },
            //自燃损失险
            txtCombustInsurance:function(data,opts){
                var carPrice = opts.carPrice;
                return  carPrice * 0.0015;
            },
            //不计免赔特约险
            txtNoDeductibleInsurance:function(data,opts){
                var damageInsurance = this.txtDamageInsurance(data,opts)||0,
                    thirdInsurance = this.txtThirdInsurance(data,opts)||0;
                return (damageInsurance + thirdInsurance) * 0.2;
            },
            //无过责任险
            txtNoLiabilityInsurance:function(data,opts){
                var thirdInsurance = this.txtThirdInsurance(data,opts)||0;
                return thirdInsurance * 0.2;

            },
            //车上人员责任险
            txtPassengerInsurance:function(data,opts){
                return opts.txtPassengerInsurance;
            },
            //车身划痕险
            txtCarBodyInsurance:function(data,opts){
                var carPrice = opts.carPrice;
                var carBodyInsureClaim = opts.rdCarBodyInsure; //赔付额度
                if (carBodyInsureClaim == 2000) {
                    if (carPrice > 0 && carPrice <= 300000) {
                        return 400
                    }
                    if (carPrice > 300000 && carPrice <= 500000) {
                        return 585
                    }
                    if (carPrice > 500000) {
                        return 850
                    }
                    return 0;

                } else if (carBodyInsureClaim == 5000) {
                    if (carPrice > 0 && carPrice <= 300000) {
                        return 570
                    }
                    if (carPrice > 300000 && carPrice <= 500000) {
                        return 900
                    }
                    if (carPrice > 500000) {
                        return 1100
                    }
                    return 0;
                } else if (carBodyInsureClaim == 10000) {
                    if (carPrice > 0 && carPrice <= 300000) {
                        return 760
                    }
                    if (carPrice > 300000 && carPrice <= 500000) {
                        return 1170
                    }
                    if (carPrice > 500000) {
                        return 1500
                    }
                    return 0;
                } else if (carBodyInsureClaim == 20000) {
                    if (carPrice > 0 && carPrice <= 300000) {
                        return 1140
                    }
                    if (carPrice > 300000 && carPrice <= 500000) {
                        return 1780
                    }
                    if (carPrice > 500000) {
                        return 2250
                    }
                    return 0;
                }

                return 0;
            },
            //首付款
            txtPrepayment:function(data,opts){
                var carPrice = opts.carPrice;
                var percent = opts.rdPrepayment - 0;
                var txtPrepayment=(options.txtPrepayment!==0&&!options.txtPrepayment)?carPrice * percent:opts.txtPrepayment;
                data.txtPrepaymentInfo="保留整数，小数点后四舍五入。";
                if(options.txtPrepayment>=carPrice)data.txtPrepaymentInfo="首付最高不能高于"+carPrice+'元';
                return Math.min(txtPrepayment,carPrice);
            },
            //贷款额
            txtBankLoan:function(data,opts){
                var carPrice = opts.carPrice;
                return carPrice - this.txtPrepayment(data,opts);
            },
            //月付款
            txtMonthPay:function(data,opts){
                var bankLoan = this.txtBankLoan(data,opts),
                    loanYears = opts.rdLoanYears;
                var months = loanYears * 12,
                    rate = 0;
                if (loanYears == 1) {
                    rate = 0.0485 / 12;
                } else if (loanYears == 2) {
                    rate = 0.0525 / 12;
                } else if (loanYears == 3) {
                    rate = 0.0525 / 12;
                } else if (loanYears == 4) {
                    rate = 0.0525 / 12;
                } else if (loanYears == 5) {
                    rate = 0.0525 / 12;
                }
                return bankLoan * ((rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1));
            },
            //贷款总花费
            loanToal:function(data,opts){
                var loanYears = opts.rdLoanYears;
                var months = loanYears * 12;
                return this.txtPrepayment(data,opts)+this.txtMonthPay(data,opts)*months
            }

        };
        var customOptions=options;
        var opts= $.extend(defaults,options);
        var data= $.extend({},opts);
        data.months=opts.rdLoanYears*12;
        //汇总
        var total={
            needful:[//必要花费小计
                "txtPurchaseTax",//购置税
                "txtLicenseTax",//上牌费用
                "txtUsageTax",//车船使用税
                "txtTrafficInsurance"//交强险
            ],
            commerce:[//商业保险小计
                "txtThirdInsurance",//第三者责任险
                "txtDamageInsurance",//车辆损失险
                "txtStolenInsurance",//全车盗抢险
                "txtGlassInsurance",//玻璃单独破碎险
                "txtCombustInsurance",//自燃损失险
                "txtNoDeductibleInsurance",//不计免赔特约险
                "txtNoLiabilityInsurance",//无过责任险
                "txtPassengerInsurance",//车上人员责任险
                "txtCarBodyInsurance"//车身划痕险
            ],
            insurance:[//新车保险指导价
                "txtTrafficInsurance",//交强险
                "commerce"//商业保险小计
            ],
            totalBuy:[//全款购车预计花费总额
                "carPrice",
                "needful",//必要花费小计
                "commerce"//商业保险小计
            ],
            loanPay:[//贷款购车预计花费总额
                "loanToal",
                "needful",//必要花费小计
                "commerce"//商业保险小计
            ],
            firstPayTotal:[//首期付款总额
                "txtPrepayment",//首付款
                "needful",//必要花费小计
                "commerce"//商业保险小计
            ]

        };
        function isString(str){
            return Object.prototype.toString.call(str)=="[object String]"
        }
        function calcTotal(total,isCommerce){//计算
            var callee=arguments.callee;

            if(!isString(total)){
                var num=0;
                for(var k in total){
                   var strKey= isString(total[k])?total[k]:k;
                   data[strKey]=callee.call(null,total[k],isCommerce||'commerce'==k);
                    if((!isCommerce||opts.CommInsureCheck[strKey])){
                        num+=data[strKey];
                    }
                }
                return num
            }
            var key=total;

            return Math.round(data[key]);
        }
        return {
            setOptions:function(options){
                opts=$.extend(opts,options);
                return this;
            },
            getData:function(key){
                for(var i in formula){
                    data[i]=Math.round(formula[i](data,opts,options[i]));
                }
                calcTotal(total);
                data.difference=data.loanPay-data.totalBuy;
                if(key){
                   return data[key];
                }
                return data;
            }

        };

    };
    root.calc=calc;
})(window.$,window);