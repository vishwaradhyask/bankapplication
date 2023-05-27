from django.urls import path

from . import views

urlpatterns = [
    path('', views.members, name='members'),
    path('register/', views.RegisterUser.as_view(), name='reg'),
    path('forgot_pwd/', views.Update.as_view(), name='forgot_pwd'),
    path('token_expired/', views.TokenExpired.as_view(), name='token_expired'),
    path('creaet_saving_account/', views.SavingAccountView.as_view(), name='savingAccount'),
    path('fetch_saving_account/', views.Checksavingaccountuser.as_view(), name='getsavingAccount'),
    path('deposite_saving_account/', views.deposite.as_view(), name='getsavingAccount'),
    path('get_user_details/', views.get_user_details.as_view(), name='get_user_details'),
    path('withdraw_saving_account/', views.withdraw.as_view(), name='withdraw'),
    path('validate_acc/', views.ValidateAcc.as_view(), name='validate'),
    path('transaction/', views.transaction.as_view(), name='transaction'),
    path('uodate_profile/', views.updateProfile.as_view(), name='updateProfile'),
    path('Delete_relationship/', views.detelate_realation.as_view(), name='detelate_realation')
]   