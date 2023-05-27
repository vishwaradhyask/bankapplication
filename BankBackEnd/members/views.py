from datetime import datetime, timedelta, timezone
import json
from django.shortcuts import render
from django.http import HttpResponse
from django.template import Context, loader
# Create your views here.
from django.shortcuts import render
from rest_framework.views import APIView
from members.serializers import UserSerilaizer, UserDetailsSerializer, SavingAccountSerializer
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from .models import UsersDetails, SavingAccount
from django.core import serializers
from django.db.models import Max


class RegisterUser(APIView):
    def post(self, request):
        data = json.loads(request.body)
        print('data', data)
        ser = UserDetailsSerializer(data=data)
        if not ser.is_valid():
            print("error", ser.error_messages, ser.errors)
            return Response({'status': 403, 'errors': ser.errors, 'message': 'something went wrong'}, status=500)
        ser.save()
        serializer = UserSerilaizer(data=data)
        if not serializer.is_valid():
            print(serializer.error_messages, serializer.errors)
            return Response({'status': 403, 'errors': serializer.errors, 'message': 'something went wrong'})
        serializer.save()
        user = User.objects.get(username=serializer.data['username'])
        token_obi, _ = Token.objects.get_or_create(user=user)
        return Response({'status': 200, 'message': 'success', 'token': str(token_obi)})


class Update(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body)
            print('data', data)
            usrd = UsersDetails.objects.get(username=data['username'])
            print('usrd', usrd)
            if (usrd.hint == data['hint']):
                usr = User.objects.get(username=data['username'])
                usr.set_password(data['password'])
                usr.save()
                usrd.password = data['password']
                usrd.save()
            else:
                return Response({'status': 403, 'message': 'entered wrong hint'}, status=404)
            return Response({'status': 200, 'message': 'success', 'token': ''})
        except Exception as E:
            print('Exception:', E)
            return Response({'status': 403, 'message': str(E)}, status=403)


class TokenExpired(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # data = json.loads(request.body)
            tkn = Token.objects.get(user=request.user)
            created = tkn.created + timedelta(hours=5, minutes=30)
            created.replace(tzinfo=None)
            nowTime = datetime.now().replace(tzinfo=timezone.utc)
            diff = nowTime - created
            diff_min = diff.seconds//60
            if (diff_min > 30):
                tkn.delete()
                tkn.save()
                return Response({'message': 'token expired'}, status=401)
            return Response({'message': 'Succuss'}, status=200)
            # createTime = datetime.strptime(tkn.created)
            # print('created time:', createTime)
        except Exception as E:
            return Response({'message': str(E)}, status=500)


def members(request):
    return render(request, 'index.html')


def checkUserPresent(user):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    try:
        UsersDetails.objects.get(username=user)
    except Exception as E:
        return Response({'status': 403, 'message': 'user is not registration:{}'.format(E)}, status=500)


def getAccountNumber():
    data = list(SavingAccount.objects.all().reverse())
    if (len(data) == 0):
        return 5204810001
    else:
        return data[0].accountnumber + 1


class SavingAccountView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        try:
            user = request.user.username
            checkUserPresent(user)
            data = json.loads(request.body)
            acc = getAccountNumber()
            data['accountnumber'] = acc
            ser = SavingAccountSerializer(data=data)
            if not ser.is_valid():
                return Response({'status': 403, 'errors': ser.errors, 'message': 'something went wrong'}, status=403)
            ser.save()
            return Response({'status': 200, 'message': 'success'}, status=200)
        except Exception as E:
            return Response({'status': 500, 'message': 'something went wrong:{}'.format(E)}, status=500)


class Checksavingaccountuser(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user.username
            print('user:', user)
            data = SavingAccount.objects.filter(username=user).values()
            print("len", len(data))
            if (len(data) > 0):
                l = []
                for i in data:
                    l.append(i)
                return Response({'status': 200, 'message': 'success', "body": l}, status=200)
            else:
                return Response({'status': 403, 'message': 'saving account not exit for this user please ceate one'}, status=403)
        except Exception as E:
            return Response({'status': 500, 'message': 'something went wrong:{}'.format(E)}, status=500)


class deposite(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            deposite = json.loads(request.body)
            print('payload:', deposite.get('balance'))
            user = request.user.username
            userdata = SavingAccount.objects.get(username=user)
            trans = userdata.transaction
            userdata.balance = float(
                format(deposite.get('balance') + userdata.balance, ".2f"))
            n = len(trans) + 1
            # print('trans: ', trans)
            trans.append({
                'Sl No': n,
                'Date': str(datetime.now()).split('.')[0],
                'Description': 'Sum of Amount Depositted',
                'Deducted': "₹ 0.00",
                'Credited': "₹ {}".format(format(deposite.get('balance'), ".2f")),
                'Balance': "₹ {}".format(format(userdata.balance, ".2f"))
            })
            userdata.transaction = trans
            # print('trans:type ', type(trans))
            userdata.save()
            return Response({'status': 200, 'message': 'success'}, status=200)
        except Exception as E:
            return Response({'status': 500, 'message': 'something went wrong:{}'.format(E)}, status=500)


class get_user_details(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user.username
            userdata = UsersDetails.objects.get(username=user)
            data = {
                'firstname':  userdata.firstname,
                'lastname':  userdata.lastname,
                'username':  userdata.username,
                'password':  userdata.password,
                'emailid':  userdata.emaid,
                'phone':  userdata.phone,
                'hint':  userdata.hint,
            }
            return Response({'status': 200, 'message': 'success', 'body': data}, status=200)
        except Exception as E:
            return Response({'status': 500, 'message': 'something went wrong:{}'.format(E)}, status=500)

class withdraw(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            with_draw = json.loads(request.body)
            print(with_draw["amount"])
            user = request.user.username
            print("user", user)
            userdata = SavingAccount.objects.get(username=user)
            print(userdata.balance)
            trans = userdata.transaction
            if (with_draw["amount"] <= userdata.balance):
                userdata.balance -= with_draw["amount"]
                n = len(trans) + 1
            # print('trans: ', trans)
                trans.append({
                    'Sl No': n,
                    'Date': str(datetime.now()).split('.')[0],
                    'Description': 'Sum of Amount withdrawed',
                    'Deducted': f'₹ {format(with_draw["amount"], ".2f")}',
                    'Credited': "₹ 0.00",
                    'Balance': "₹ {}".format(format(userdata.balance, ".2f"))
                })
                userdata.transaction = trans
                userdata.save()
                print("after detect", userdata.balance)
            else:

                return Response({'status': 403, 'message': 'Insuffecient balance!!'}, status=403)
            return Response({'status': 200, 'message': 'success'}, status=200)

        except Exception as E:
            return Response({'status': 500, 'message': 'something went wrong:{}'.format(E)}, status=500)


class transaction(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            transaction_details = json.loads(request.body)
            TansAcco = transaction_details['account_no']
            amnt = transaction_details['amnt']
            user = request.user.username
            tran_user = SavingAccount.objects.get(accountnumber=TansAcco)
            cur_user = SavingAccount.objects.get(username=user)
            # depisite to benificiers
            tran_user.balance += amnt
            tran_trans = tran_user.transaction
            t_n = len(tran_trans) + 1
            tran_trans.append({
                'Sl No': t_n,
                'Date': str(datetime.now()).split('.')[0],
                'Description': f'Sum of Amount Depositted from the Acc no: {cur_user.accountnumber}',
                'Deducted': "₹ 0.00",
                'Credited': f'₹ {format(amnt, ".2f")}',
                'Balance': "₹ {}".format(format(tran_user.balance, ".2f"))
            })
            tran_user.transaction = tran_trans
            tran_user.save()
            # withdraw ti current user
            cur_user.balance -= amnt
            cur_trans = cur_user.transaction
            c_n = len(cur_trans) + 1
            cur_trans.append({
                'Sl No': c_n,
                'Date': str(datetime.now()).split('.')[0],
                'Description': f'Sum of Amount Transfered to ACC No: {tran_user.accountnumber}',
                'Deducted': f'₹ {format(amnt, ".2f")}',
                'Credited': "₹ 0.00",
                'Balance': "₹ {}".format(format(cur_user.balance, ".2f"))
            })
            cur_user.transaction = cur_trans
            cur_user.save()
            print('Cur user:', cur_user)
            print('TRans user:', tran_user)
            return Response({'status': 200, 'message': 'success'}, status=200)
        except Exception as E:
            return Response({'status': 500, 'message': 'Transaction Failed:{}'.format(E)}, status=500)


class ValidateAcc(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            body = json.loads(request.body)
            # print('body: ', body)
            if body['account_no'] is not None:
                user = SavingAccount.objects.filter(
                    accountnumber=body['account_no']).values()
                print('user, ', user)
                if (user is not None and len(user) > 0):
                    return Response({'status': 200, 'message': 'success', 'body': user}, status=200)
                return Response({'status': 200, 'message': 'could not found user'}, status=403)
            return Response({'status': 200, 'message': 'could not found user'}, status=403)
        except Exception as E:
            return Response({'status': 500, 'message': 'Failed to validate:{}'.format(E)}, status=500)


class updateProfile(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            body = json.loads(request.body)
            print('body: ', body)
            user = request.user.username
            print('usr for update: ', user)
            user_details = UsersDetails.objects.get(username=user)
            sav_details  = SavingAccount.objects.get(username=user)
            print('user account: ', user_details)
            print('sav_details: ', sav_details)
            user_details.firstname = body['fn']
            user_details.lastname = body['ln']
            user_details.emaid = body['ei']
            user_details.phone = body['pn']
            user_details.save()

            sav_details.firstname = body['fn']
            sav_details.lastname = body['ln']
            sav_details.emaid = body['ei']
            sav_details.phone = body['pn']
            sav_details.save()
            return Response({'status': 200, 'message': 'success'}, status=200)
        except Exception as E:
            return Response({'status': 500, 'message': 'Failed to validate:{}'.format(E)}, status=500)

class detelate_realation(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user.username
            print('usr for update: ', user)
            user_details = UsersDetails.objects.get(username=user)
            sav_details  = SavingAccount.objects.get(username=user)
            tok_usr = User.objects.get(username=user)
            print('user account: ', user_details)
            print('sav_details: ', sav_details)
            user_details.delete()
            sav_details.delete()
            tok_usr.delete()
            return Response({'status': 200, 'message': 'success'}, status=200)
        except Exception as E:
            return Response({'status': 500, 'message': 'Failed to validate:{}'.format(E)}, status=500)